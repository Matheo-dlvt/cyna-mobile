import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import BaseButton from "../../components/BaseButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Routes } from "../../navigation/Routes";

const STRIPE_PK =
  "pk_test_51RHl0nP3G6YqBCSln3FADBnkJN9na8kiqvsczrPWePhnqWXvfyA6FE9zat0QujYCYs5xl6mLqxcXEgOoTh6xQRP000Lfjyt5Bd";

const API_ROUTES = {
  CANCEL_SETUP_INTENT: "http://127.0.0.1:8000/api/checking/cancel-setup-intent",
  NEW_SETUP_INTENT: "http://127.0.0.1:8000/api/checking/create-setup-intent",
  CHECKOUT: "http://127.0.0.1:8000/api/checking",
};

type ApiResponse<T> = { data?: T; error?: { message: string } };

async function postRequest<TReq, TRes>(
  url: string,
  body: TReq
): Promise<ApiResponse<TRes>> {
  const access = await AsyncStorage.getItem("access");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      return { error: { message: json.message || res.statusText } };
    }
    return { data: json as TRes };
  } catch (e: any) {
    return { error: { message: e.message } };
  }
}

type RootStackParamList = {
  Checkout: { orderId: number };
};

type CheckoutRouteProp = RouteProp<RootStackParamList, "Checkout">;

const CheckoutScreen: React.FC = () => {
  const { params } = useRoute<CheckoutRouteProp>();
  const navigation = useNavigation();
  const { confirmSetupIntent, confirmPayment } = useStripe();

  const [loading, setLoading] = useState(true);
  const [intentId, setIntentId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await postRequest<
          { orderId: number },
          { intentId: string; clientSecret: string }
        >(API_ROUTES.NEW_SETUP_INTENT, { orderId: params.orderId });
        if (error || !data) throw new Error(error?.message || "Init failed");

        setIntentId(data.intentId);
        setClientSecret(data.clientSecret);
      } catch (e: any) {
        Alert.alert("Error", e.message || "Payment init error");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [params.orderId]);

  const handlePay = useCallback(async () => {
    setLoading(true);
    const { setupIntent, error: setupError } = await confirmSetupIntent(
      clientSecret,
      {
        paymentMethodType: "Card",
        paymentMethodData: {},
      }
    );
    if (setupError || !setupIntent.paymentMethod) {
      Alert.alert("Setup Error", setupError?.message || "Failed");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await postRequest<
        { orderId: number; paymentMethodId: string; paymentMethodType: string },
        { payments: { clientSecret: string; type: string }[] }
      >(API_ROUTES.CHECKOUT, {
        orderId: params.orderId,
        paymentMethodId: setupIntent.paymentMethod.id,
        paymentMethodType: setupIntent.paymentMethodTypes[0],
      });
      if (error || !data) throw new Error(error?.message || "Checkout API");

      for (const payment of data.payments) {
        const { error: payError } = await confirmPayment(payment.clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: { paymentMethodId: setupIntent.paymentMethod.id },
        });
        if (payError) throw new Error(payError.message);
      }

      navigation.navigate(Routes.OrderSuccessScreen as never);
    } catch (e: any) {
      Alert.alert("Payment Error", e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }, [
    clientSecret,
    confirmSetupIntent,
    confirmPayment,
    navigation,
    params.orderId,
  ]);

  const handleCancel = useCallback(async () => {
    setLoading(true);
    try {
      await postRequest(API_ROUTES.CANCEL_SETUP_INTENT, { intentId });
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    navigation.goBack();
  }, [intentId, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={STRIPE_PK}>
      <View style={styles.container}>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: "4242 4242 4242 4242",
            expiration: "MM/YY",
            cvc: "CVC",
          }}
          onCardChange={(card) => setCardComplete(!!card.complete)}
          style={styles.cardField}
        />

        <View style={styles.buttons}>
          <BaseButton label="Annuler" onPress={handleCancel} />

          <BaseButton
            label={loading ? "Traitement…" : "Payer"}
            onPress={handlePay}
            disabled={!cardComplete || loading}
          />
        </View>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16, justifyContent: "center" },
  cardField: { width: "100%", height: 50, marginVertical: 30 },
  buttons: { flexDirection: "column", gap: 5 },
  buttonSmall: { flex: 1, marginRight: 10 },
  buttonLarge: { flex: 2 },
});

export default CheckoutScreen;
