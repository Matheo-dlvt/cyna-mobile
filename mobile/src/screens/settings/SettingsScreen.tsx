import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";

const SettingsScreen: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fetchUserData = async () => {
    try {
      let access = await AsyncStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (response.status === 401) {
        await refreshTokens();
        return await fetchUserData();
      }

      const data = await response.json();
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
    } catch (error) {
      console.error("Erreur lors de la récupération des infos:", error);
      Alert.alert("Erreur", "Impossible de charger vos informations.");
    }
  };

  const refreshTokens = async () => {
    const refresh = await AsyncStorage.getItem("refresh");
    const response = await fetch("http://127.0.0.1:8000/api/auth/refresh/mobile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem("access", data.access);
      await AsyncStorage.setItem("refresh", data.refresh);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
    } else {
      Alert.alert("Session expirée", "Veuillez vous reconnecter.");
    }
  };

  const handleUpdateInfo = async () => {
    try {
      const access = await AsyncStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ firstName, lastName, email }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      Alert.alert("Succès", "Informations mises à jour.");
    } catch (error) {
      Alert.alert("Erreur", (error as Error).message);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const access = await AsyncStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          previousPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors du changement de mot de passe");
      Alert.alert("Succès", "Mot de passe mis à jour.");
    } catch (error) {
        Alert.alert("Erreur", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.sectionTitle}>Informations personnelles</Text>
      <BaseInput placeholder="Prénom" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <BaseInput placeholder="Nom" value={lastName} onChangeText={setLastName} style={styles.input} />
      <BaseInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <BaseButton label="Mettre à jour" onPress={handleUpdateInfo} />

      <Text style={styles.sectionTitle}>Changer le mot de passe</Text>
      <BaseInput placeholder="Ancien mot de passe" value={previousPassword} onChangeText={setPreviousPassword} secureTextEntry style={styles.input} />
      <BaseInput placeholder="Nouveau mot de passe" value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
      <BaseInput placeholder="Confirmer le mot de passe" value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry style={styles.input} />
      <BaseButton label="Changer le mot de passe" onPress={handlePasswordChange} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },
  input: {
    marginBottom: 12,
  },
});

export default SettingsScreen;
