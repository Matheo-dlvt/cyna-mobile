import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigation/Routes";

const OrderSuccessScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGoToSubscriptions = () => {
    navigation.navigate(Routes.SubscriptionsTab as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Commande réussie !</Text>
      <Text style={styles.text}>Merci pour votre achat.</Text>
      <Text style={styles.text}>Vous pouvez retrouver votre abonnement dans l'onglet "Mes abonnements".</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoToSubscriptions}>
        <Text style={styles.buttonText}>Voir mes abonnements</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#22c55e",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#814DFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
