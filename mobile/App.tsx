import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CrispChat, { configure, show } from "react-native-crisp-chat-sdk";
import TabNavigator from "./src/navigation/TabNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { CRISP_TOKEN } from "@env";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function App() {
  configure(CRISP_TOKEN);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AuthContext.Consumer>
            {({ isAuthenticated }) =>
              isAuthenticated ? <TabNavigator /> : <AuthNavigator />
            }
          </AuthContext.Consumer>
          <CrispChat />
          <TouchableOpacity style={styles.fab} onPress={show}>
            <Text style={styles.fabText}>💬</Text>
          </TouchableOpacity>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 95,
    right: 10,
    width: 44,
    height: 44,
    borderRadius: 28,
    backgroundColor: "#0484FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
  },
});
