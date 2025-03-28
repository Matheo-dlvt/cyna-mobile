import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import { Routes } from "../Routes";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SettingsScreen}
        component={SettingsScreen}
        options={{ headerShown: true, title: "Paramètres" }}
      />
    </Stack.Navigator>
  );
}