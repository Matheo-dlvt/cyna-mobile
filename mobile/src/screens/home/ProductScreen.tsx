import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";

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
});

export default ProductScreen;
