import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import TabNavigator from "./src/navigation/TabNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AuthContext.Consumer>
            {({ isAuthenticated }) =>
              isAuthenticated ? <TabNavigator /> : <AuthNavigator />
            }
          </AuthContext.Consumer>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
