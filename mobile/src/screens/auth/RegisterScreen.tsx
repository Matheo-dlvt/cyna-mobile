import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword}),
      });
      console.log(JSON.stringify({ firstName, lastName, email, password, confirmPassword}));
      if (!response.ok) throw new Error("Erreur lors de l'inscription.");
      const data = await response.json();

      await AsyncStorage.setItem("access", data.access);
      await AsyncStorage.setItem("refresh", data.refresh);
      await AsyncStorage.setItem("userId", data.user.id.toString());
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <BaseInput placeholder="Prénom" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <BaseInput placeholder="Nom" value={lastName} onChangeText={setLastName} style={styles.input} />
      <BaseInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <BaseInput placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <BaseInput placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

      <BaseButton label="S'inscrire" onPress={handleRegister} />

      <Text style={styles.bottomText}>
        Déjà un compte ?
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}> Connexion</Text>
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

export default RegisterScreen;
