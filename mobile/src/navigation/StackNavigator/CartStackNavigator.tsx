import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CartScreen from "../../screens/cart/CartScreen";
import { Routes } from "../Routes";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.CartScreen}
        component={CartScreen}
        options={{ headerShown: true, title: "Panier" }}
      />
    </Stack.Navigator>
  );
}