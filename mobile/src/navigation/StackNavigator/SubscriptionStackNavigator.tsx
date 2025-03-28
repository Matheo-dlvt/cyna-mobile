import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SubscriptionsScreen from "../../screens/subscriptions/SubscriptionsScreen";
import { Routes } from "../Routes";
const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.HomeScreen}
        component={SubscriptionsScreen}
        options={{ headerShown: true, title: "Mes abonnements" }}
      />
    </Stack.Navigator>
  );
}