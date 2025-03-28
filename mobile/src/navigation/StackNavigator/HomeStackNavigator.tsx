import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../../screens/home/HomeScreen";
import ProductScreen from "../../screens/home/ProductScreen";
import { Routes } from "../Routes";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: true, title: "Accueil" }}
      />
      <Stack.Screen
        name={Routes.ProductScreen}
        component={ProductScreen}
        options={{ headerShown: true, title: "Page produit" }}
      />
    </Stack.Navigator>
  );
}