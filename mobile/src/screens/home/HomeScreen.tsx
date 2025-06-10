import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigation/Routes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

interface Product {
  id: number;
  name: string;
  price: number;
  slides: string[];
  details: {
    locale: string;
    descriptionText: string;
  }[];
}

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/get-all")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Erreur produits :", err));
  }, []);

  const renderProduct = ({ item }: { item: Product }) => {
    const description = item.details.find(d => d.locale === "fr")?.descriptionText || "Aucune description.";
    const shortDesc = description.length > 100 ? description.slice(0, 100) + "..." : description;
    const image = item.slides[0] || null;

    return (
      <TouchableOpacity onPress={() => navigation.navigate("ProductScreen", { productId: item.id })}>
        <View style={styles.card}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{shortDesc}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher un produit..."
        placeholderTextColor="#888"
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "hsl(221, 80%, 4%)",
    padding: 16,
  },
  searchBar: {
    backgroundColor: "hsl(257, 69%, 10%)",
    color: "#fff",
    padding: 10,
    borderWidth: 1.5,
    borderColor: "hsl(224, 31%, 15%)",
    borderRadius: 8,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "hsl(257, 69%, 10%)",
    borderWidth: 1.5,
    borderColor: "hsl(224, 31%, 15%)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  desc: {
    color: "#ccc",
    fontSize: 14,
  },
});

export default HomeScreen;
