import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import { Routes } from "../Routes";
import { LinearGradient } from "expo-linear-gradient";
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
        name={Routes.SettingsScreen}
        component={SettingsScreen}
        options={{ headerShown: true, title: "Paramètres" }}
      />
    </Stack.Navigator>
  );
}