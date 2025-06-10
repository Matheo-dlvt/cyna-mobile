import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import HomeStackNavigator from "./StackNavigator/HomeStackNavigator";
import SubscriptionsStackNavigator from "./StackNavigator/SubscriptionStackNavigator";
import SettingsStackNavigator from "./StackNavigator/SettingsStackNavigator";
import CartStackNavigator from "./StackNavigator/CartStackNavigator";
import { Routes } from "./Routes";
import { LinearGradient } from "expo-linear-gradient";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = "";

          if (route.name === Routes.HomeTab) {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === Routes.SubscriptionsTab) {
            iconName = focused ? "clipboard" : "clipboard-outline";
          } else if (route.name === Routes.SettingsTab) {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === Routes.CartTab) {
            iconName = focused ? "basket" : "basket-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarBackground: () => (
          <LinearGradient
            colors={["hsl(251, 60%, 16%)", "hsl(263, 69%, 49%)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerShown: false,
      })}
    >
      <Tab.Screen name={Routes.HomeTab} component={HomeStackNavigator} />
      <Tab.Screen name={Routes.SubscriptionsTab} component={SubscriptionsStackNavigator} />
      <Tab.Screen name={Routes.SettingsTab} component={SettingsStackNavigator} />
      <Tab.Screen name={Routes.CartTab} component={CartStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;