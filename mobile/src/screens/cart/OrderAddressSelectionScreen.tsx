import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import BaseInput from "../../components/BaseInput";
import BaseButton from "../../components/BaseButton";
import { useNavigation, useRoute } from "@react-navigation/native";

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

const OrderAddressSelectionScreen: React.FC = () => {
  const route = useRoute();
  const [currentFormType, setCurrentFormType] = useState<0 | 1>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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
  const { cartId } = (route.params || {}) as { cartId: number };

  const [selectedBillingId, setSelectedBillingId] = useState<number | null>(
    null
  );
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(
    null
  );

  const navigation = useNavigation();

  const fetchAddresses = async () => {
    const access = await AsyncStorage.getItem("access");
    const response = await fetch(
      "http://127.0.0.1:8000/api/addresses/get-all",
      {
        headers: { Authorization: `Bearer ${access}` },
      }
    );

    if (response.status === 404) {
      setAddresses([]);
      return;
    }

    const data = await response.json();
    setAddresses(Array.isArray(data) ? data : []);
  };

  const handleAddAddress = async () => {
    const access = await AsyncStorage.getItem("access");

    const response = await fetch("http://127.0.0.1:8000/api/addresses/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({ ...form, type: currentFormType }),
    });

    if (!response.ok) {
      Alert.alert("Erreur", "Impossible d'ajouter l'adresse");
      return;
    }

    setModalVisible(false);
    await fetchAddresses();
  };

  const updateOrder = async () => {
    const access = await AsyncStorage.getItem("access");
    try {
      await fetch("http://127.0.0.1:8000/api/orders/update-order", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          orderId: cartId,
          status: 0,
          shippingAddressId: selectedShippingId,
          billingAddressId: selectedBillingId,
        }),
      });

      navigation.navigate("CheckoutScreen", { orderId: cartId });
    } catch (e) {
      console.warn("Error updating cart", e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const renderAddress = (
    addr: Address,
    selectedId: number | null,
    onSelect: (id: number) => void
  ) => (
    <TouchableOpacity
      key={addr.id}
      onPress={() => onSelect(addr.id)}
      style={styles.addressCard}
    >
      <View style={styles.radioRow}>
        <Ionicons
          name={selectedId === addr.id ? "radio-button-on" : "radio-button-off"}
          size={20}
          color="#814DFF"
        />
        <Text style={styles.addressText}>
          {addr.number} {addr.street}, {addr.zipCode} {addr.city}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text style={styles.sectionTitle}>Adresse de facturation</Text>
      {addresses
        .filter((a) => a.type === 0)
        .map((addr) =>
          renderAddress(addr, selectedBillingId, setSelectedBillingId)
        )}
      <TouchableOpacity
        onPress={() => {
          setCurrentFormType(0);
          setForm({
            type: 0,
            street: "",
            number: "",
            complement: "",
            zipCode: "",
            city: "",
            region: "",
            country: "",
          });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addBtn}>+ Ajouter une adresse de facturation</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Adresse de livraison</Text>
      {addresses
        .filter((a) => a.type === 1)
        .map((addr) =>
          renderAddress(addr, selectedShippingId, setSelectedShippingId)
        )}
      <TouchableOpacity
        onPress={() => {
          setCurrentFormType(1);
          setForm({
            type: 1,
            street: "",
            number: "",
            complement: "",
            zipCode: "",
            city: "",
            region: "",
            country: "",
          });
          setModalVisible(true);
        }}
      >
        <Text style={styles.addBtn}>+ Ajouter une adresse de livraison</Text>
      </TouchableOpacity>

      <BaseButton label="Continuer vers le paiement" onPress={updateOrder} />

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#1c143d",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Text
              style={{ color: "#fff", fontWeight: "bold", marginBottom: 16 }}
            >
              Formulaire adresse
            </Text>
            <BaseInput
              placeholder="N° de rue"
              value={form.number}
              onChangeText={(v) => setForm({ ...form, number: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Nom de rue"
              value={form.street}
              onChangeText={(v) => setForm({ ...form, street: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Complément"
              value={form.complement}
              onChangeText={(v) => setForm({ ...form, complement: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Code postal"
              value={form.zipCode}
              onChangeText={(v) => setForm({ ...form, zipCode: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Ville"
              value={form.city}
              onChangeText={(v) => setForm({ ...form, city: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Région"
              value={form.region}
              onChangeText={(v) => setForm({ ...form, region: v })}
              style={styles.input}
            />
            <BaseInput
              placeholder="Pays"
              value={form.country}
              onChangeText={(v) => setForm({ ...form, country: v })}
              style={styles.input}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
                gap: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <BaseButton
                  label="Annuler"
                  onPress={() => setModalVisible(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <BaseButton label="Ajouter" onPress={handleAddAddress} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    marginVertical: 12,
  },
  addressCard: {
    backgroundColor: "#1c143d",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    color: "#fff",
    marginLeft: 10,
  },
  addBtn: {
    color: "#3b82f6",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
});

export default OrderAddressSelectionScreen;
