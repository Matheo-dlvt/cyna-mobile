import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "../../screens/home/HomeScreen";
import ProductScreen from "../../screens/home/ProductScreen";
import { Routes } from "../Routes";

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
