import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { AuthContext } from "../../context/AuthContext";

const LoginScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login/mobile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Identifiants invalides.");
      }

      const data = await response.json();

      await login(data.access, data.refresh);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

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
  errorText: {
    color: "#ff4d4d",
    marginBottom: 10,
    textAlign: "center",
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
