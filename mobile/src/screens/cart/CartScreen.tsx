import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    slides: string[];
  };
  quantity: number;
  recurring: number;
}

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const access = await AsyncStorage.getItem("access");
    const response = await fetch("http://127.0.0.1:8000/api/orders/get-cart", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    const data = await response.json();
    setItems(data.items);
    setLoading(false);
  };

  const updateQuantityOrRecurring = async (
    productId: number,
    quantity: number,
    recurring: number,
    itemId: number
  ) => {
    const access = await AsyncStorage.getItem("access");

    if (quantity <= 0) {
      await fetch(`http://127.0.0.1:8000/api/orders/delete-cart-item/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/orders/update-cart-item", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ productId, quantity, recurring }),
      });
    }

    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity) / 100, 0);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#814DFF" />;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 200 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.product.slides[0] }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.price}>
                {((item.product.price * item.quantity) / 100).toFixed(2)} €
                <Text style={{ color: "#888", fontSize: 12 }}>
                  {"  "}({(item.product.price / 100).toFixed(2)} € / unité)
                </Text>
              </Text>

              <Text style={styles.label}>Type d'abonnement</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={item.recurring}
                  onValueChange={(value) =>
                    updateQuantityOrRecurring(item.product.id, item.quantity, value, item.id)
                  }
                  style={styles.picker}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Mensuel" value={1} />
                  <Picker.Item label="Annuel" value={2} />
                </Picker>
              </View>

              <View style={styles.quantityRow}>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantityOrRecurring(item.product.id, item.quantity - 1, item.recurring, item.id)
                  }
                  style={[styles.qtyButton, item.quantity === 1 && styles.deleteButton]}
                >
                  <Text style={styles.qtyText}>{item.quantity === 1 ? "🗑️" : "-"}</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantityOrRecurring(item.product.id, item.quantity + 1, item.recurring, item.id)
                  }
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalTitle}>Total</Text>
          <Text style={styles.totalPrice}>{total.toFixed(2)} €</Text>
        </View>
        <View style={styles.breakdown}>
          <Text style={styles.breakdownText}>Sous-total</Text>
          <Text style={styles.breakdownText}>{total.toFixed(2)} €</Text>
        </View>
        <View style={styles.breakdown}>
          <Text style={styles.breakdownText}>Livraison</Text>
          <Text style={styles.breakdownText}>0 €</Text>
        </View>
        <View style={styles.breakdown}>
          <Text style={styles.breakdownText}>Promotion</Text>
          <Text style={styles.breakdownText}>0 €</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("OrderAddressSelectionScreen" as never)}
        >
          <Text style={styles.checkoutText}>Passer la commande</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0d12",
    padding: 16,
  },
  card: {
    backgroundColor: "#1c143d",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    color: "#ccc",
    marginTop: 4,
    marginBottom: 10,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    backgroundColor: "#814DFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },
  qtyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  qtyValue: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 12,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  pickerWrapper: {
    marginTop: 5,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: "hsl(221, 80%, 4%)",
    marginBottom: 12,
  },
  picker: {
    height: 20,
    color: "#fff",
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "hsl(221, 80%, 4%)",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1c143d",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#333",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  breakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  breakdownText: {
    color: "#ccc",
  },
  checkoutButton: {
    backgroundColor: "#814DFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  checkoutText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CartScreen;
