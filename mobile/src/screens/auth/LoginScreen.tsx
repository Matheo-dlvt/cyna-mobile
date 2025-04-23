import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Exemple d'appel API de login
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Identifiants invalides.");
      }

      const data = await response.json();

      // Stockage du token et de l'userId
      await AsyncStorage.setItem("access", data.access);
      await AsyncStorage.setItem("refresh", data.refresh);
      await AsyncStorage.setItem("userId", data.user.id.toString());

      // Reload app (le changement sera pris en compte dans App.tsx)
      // Tu peux utiliser un contexte ou navigation si besoin
    } catch (error: any) {
      Alert.alert("Connexion échouée", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <BaseInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <BaseInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <BaseButton label="Se connecter" onPress={handleLogin} />

      <Text style={styles.bottomText}>
      Pas encore de compte ?
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}> S'inscrire</Text>
      </TouchableOpacity>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f9f9f9",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
  bottomText: {
    marginTop: 15,
    color: "#ccc",
  },
  link: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
});

export default LoginScreen;
