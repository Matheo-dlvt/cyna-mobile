import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CartScreen from "../../screens/cart/CartScreen";
import OrderAddressSelectionScreen from "../../screens/cart/OrderAddressSelectionScreen";
import { Routes } from "../Routes";
import { LinearGradient } from "expo-linear-gradient";
import CheckoutScreen from "../../screens/cart/CheckoutScreen";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackground: () => (
          <LinearGradient
            colors={["hsl(251, 60%, 16%)", "hsl(263, 69%, 49%)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      <Stack.Screen
        name={Routes.CartScreen}
        component={CartScreen}
        options={{ headerShown: true, title: "Panier" }}
      />
      <Stack.Screen
        name={Routes.OrderAddressSelectionScreen}
        component={OrderAddressSelectionScreen}
        options={{ headerShown: true, title: "Adresses" }}
      />
      <Stack.Screen
        name={Routes.CheckoutScreen}
        component={CheckoutScreen}
        options={{ headerShown: true, title: "Checkout" }}
      />
    </Stack.Navigator>
  );
}
