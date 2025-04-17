import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  const toggleBought = async () => {
    const stored = await AsyncStorage.getItem("zakupy");
    let products = stored ? JSON.parse(stored) : [];

    products = products.map((p) =>
      p.id === product.id ? { ...p, isBought: !p.isBought } : p
    );

    await AsyncStorage.setItem("zakupy", JSON.stringify(products));
    navigation.goBack();
  };

  const deleteProduct = async () => {
    Alert.alert(
      "Usunąć produkt?",
      `${product.name}`,
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            const stored = await AsyncStorage.getItem("zakupy");
            let products = stored ? JSON.parse(stored) : [];
            products = products.filter((p) => p.id !== product.id);
            await AsyncStorage.setItem("zakupy", JSON.stringify(products));
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!product) {
    return <Text>No product data available.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.text}>Price: {product.price} zł</Text>
      <Text style={styles.text}>Store: {product.store}</Text>
      <Text style={styles.text}>
        Status: {product.isBought ? "Bought" : "Not bought"}
      </Text>

      <View style={{ marginVertical: 20 }}>
        <Button
          title={product.isBought ? "Mark as not bought" : "Mark as bought"}
          onPress={toggleBought}
        />
      </View>

      <Button title="🗑 Delete product" color="red" onPress={deleteProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 6 },
});
