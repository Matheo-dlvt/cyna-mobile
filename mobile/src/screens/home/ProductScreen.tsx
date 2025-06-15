import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../navigation/types";
import { Picker } from "@react-native-picker/picker";

type ProductScreenRouteProp = RouteProp<RootStackParamList, "ProductScreen">;

interface ProductDetail {
  id: number;
  name: string;
  slides: string[];
  price: number;
  category: { id: number; globalName: string };
  details: {
    locale: string;
    descriptionTitle: string;
    descriptionText: string;
    benefits: { title: string; description: string }[];
  }[];
}

const ProductScreen: React.FC = () => {
  const route = useRoute<ProductScreenRouteProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [recurring, setRecurring] = useState(1); // 1 = monthly, 2 = yearly

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/get/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur produit :", err);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      const access = await AsyncStorage.getItem("access");

      const response = await fetch("http://127.0.0.1:8000/api/orders/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
          recurring: recurring,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout au panier");
      Alert.alert("Succès", "Produit ajouté au panier !");
    } catch (err: any) {
      Alert.alert("Erreur", err.message || "Une erreur s’est produite");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3b82f6" style={{ flex: 1 }} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Produit introuvable.</Text>
      </View>
    );
  }

  const frDetails = product.details.find(d => d.locale === "fr");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{product.name}</Text>

      {product.slides[0] && (
        <Image source={{ uri: product.slides[0] }} style={styles.image} />
      )}

      {frDetails && (
        <>
          <Text style={styles.subtitle}>{frDetails.descriptionTitle}</Text>
          <Text style={styles.desc}>{frDetails.descriptionText}</Text>

          <Text style={styles.benefitTitle}>Bénéfices :</Text>
          {frDetails.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitItemTitle}>• {benefit.title}</Text>
              <Text style={styles.benefitItemText}>{benefit.description}</Text>
            </View>
          ))}
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Type de paiement</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={recurring}
            onValueChange={(value) => setRecurring(value)}
            style={styles.picker}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Mensuel" value={1} />
            <Picker.Item label="Annuel" value={2} />
          </Picker>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 12 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#814DFF", padding: 8, borderRadius: 8 }}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>-</Text>
          </TouchableOpacity>
          <Text style={{ color: "#fff", marginHorizontal: 12 }}>{quantity}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#814DFF", padding: 8, borderRadius: 8 }}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleAddToCart} style={{ backgroundColor: "#A954FF", padding: 12, borderRadius: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "hsl(221, 80%, 4%)",
    padding: 16,
    flexGrow: 1,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  desc: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 16,
  },
  benefitTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  benefitItem: {
    marginBottom: 12,
  },
  benefitItemTitle: {
    color: "#3b82f6",
    fontWeight: "bold",
  },
  benefitItemText: {
    color: "#ccc",
    fontSize: 13,
  },
  errorText: {
    color: "#ff4d4d",
    textAlign: "center",
    marginTop: 40,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: "hsl(257, 69%, 10%)",
    marginBottom: 12,
  },
  picker: {
    height: 30,
    color: "#fff",
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "hsl(257, 69%, 10%)",
  },

});

export default ProductScreen;
