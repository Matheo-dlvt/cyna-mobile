import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


interface Address {
  id: number;
  type: number;
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  region: string;
  country: string;
}

const SettingsScreen: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const [form, setForm] = useState<Omit<Address, "id">>({
    type: 0,
    street: "",
    number: "",
    complement: "",
    zipCode: "",
    city: "",
    region: "",
    country: "",
  });

  const fetchUserData = async () => {
    try {
      let access = await AsyncStorage.getItem("access");
      const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const data = await response.json();
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
    } catch {
      Alert.alert("Erreur", "Impossible de charger vos informations.");
    }
  };

  const fetchAddresses = async () => {
    const access = await AsyncStorage.getItem("access");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/addresses/get-all", {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (response.status === 404) return setAddresses([]);
      const data = await response.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert("Erreur", "Impossible de charger les adresses.");
    }
  };

  const refreshTokens = async () => {
    const refresh = await AsyncStorage.getItem("refresh");
    const response = await fetch("http://127.0.0.1:8000/api/auth/refresh/mobile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (response.ok) {
      const data = await response.json();
      await AsyncStorage.setItem("access", data.access);
      await AsyncStorage.setItem("refresh", data.refresh);
    }
  };

  const handleUpdateInfo = async () => {
    const access = await AsyncStorage.getItem("access");
    await fetch("http://127.0.0.1:8000/api/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ firstName, lastName, email }),
    });
    Alert.alert("Succès", "Informations mises à jour.");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }
    const access = await AsyncStorage.getItem("access");
    await fetch("http://127.0.0.1:8000/api/users/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ previousPassword, newPassword, confirmNewPassword }),
    });
    Alert.alert("Succès", "Mot de passe mis à jour.");
  };

  const handleSubmitAddress = async () => {
    const access = await AsyncStorage.getItem("access");
    const url = editingAddress ? "update" : "add";
    const method = editingAddress ? "PUT" : "POST";
    const body = editingAddress ? { ...form, id: editingAddress.id } : form;
    await fetch(`http://127.0.0.1:8000/api/addresses/${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(body),
    });
    setModalVisible(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const confirmDelete = (id: number) => {
    setAddressToDelete(id);
    setConfirmDeleteModal(true);
  };

  const openEditModal = (addr: Address) => {
    setForm({ ...addr });
    setEditingAddress(addr);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const { logout } = useContext(AuthContext);


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

      <View style={{ marginTop: 32 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Adresse de facturation</Text>
          <TouchableOpacity onPress={() => { setForm({ type: 0, street: "", number: "", complement: "", zipCode: "", city: "", region: "", country: "" }); setEditingAddress(null); setModalVisible(true); }}>
            <View style={{ backgroundColor: "#000", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ color: "#fff" }}>Nouvelle adresse</Text>
            </View>
          </TouchableOpacity>
        </View>

        {addresses.map((addr) => (
          <View key={addr.id} style={{ borderColor: "#fff", borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "#fff" }}>{addr.number} {addr.street}</Text>
              <TouchableOpacity onPress={() => openEditModal(addr)}>
                <Ionicons name="pencil" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <Text style={{ color: "#ccc" }}>{addr.city}, {addr.zipCode}</Text>
              <TouchableOpacity onPress={() => confirmDelete(addr.id)}>
                <Ionicons name="trash" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Formulaire modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.8)", padding: 20 }}>
          <View style={{ backgroundColor: "#1c143d", borderRadius: 12, padding: 20 }}>
            <Text style={{ color: "#fff", fontWeight: "bold", marginBottom: 16 }}>Formulaire adresse</Text>
            <BaseInput placeholder="N° de rue" value={form.number} onChangeText={(v) => setForm({ ...form, number: v })} style={styles.input} />
            <BaseInput placeholder="Nom de rue" value={form.street} onChangeText={(v) => setForm({ ...form, street: v })} style={styles.input} />
            <BaseInput placeholder="Complément" value={form.complement} onChangeText={(v) => setForm({ ...form, complement: v })} style={styles.input} />
            <BaseInput placeholder="Code postal" value={form.zipCode} onChangeText={(v) => setForm({ ...form, zipCode: v })} style={styles.input} />
            <BaseInput placeholder="Ville" value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} style={styles.input} />
            <BaseInput placeholder="Région" value={form.region} onChangeText={(v) => setForm({ ...form, region: v })} style={styles.input} />
            <BaseInput placeholder="Pays" value={form.country} onChangeText={(v) => setForm({ ...form, country: v })} style={styles.input} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 8 }}>
              <View style={{ flex: 1 }}>
                <BaseButton label="Annuler" onPress={() => setModalVisible(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <BaseButton label={editingAddress ? "Modifier" : "Ajouter"} onPress={handleSubmitAddress} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation suppression */}
      <Modal visible={confirmDeleteModal} animationType="fade" transparent>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" }}>
          <View style={{ backgroundColor: "#1c143d", padding: 24, borderRadius: 12, width: "80%" }}>
            <Text style={{ color: "#fff", fontSize: 16, marginBottom: 20 }}>Supprimer cette adresse ?</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <BaseButton label="Annuler" onPress={() => setConfirmDeleteModal(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <BaseButton
                  label="Supprimer"
                  onPress={async () => {
                    if (!addressToDelete) return;
                    const access = await AsyncStorage.getItem("access");
                    await fetch(`http://127.0.0.1:8000/api/addresses/delete/${addressToDelete}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${access}` },
                    });
                    setConfirmDeleteModal(false);
                    setAddressToDelete(null);
                    fetchAddresses();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{ marginTop: 40 }}>
        <BaseButton
          label="Se déconnecter"
          onPress={logout}
          style={{ backgroundColor: "#ff4d4d" }}
        />
      </View>
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
