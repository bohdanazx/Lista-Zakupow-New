// ProductDetailScreen.js
import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  const toggleBought = async () => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        isBought: !product.isBought,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const deleteProduct = async () => {
    Alert.alert(
      "Delete product?",
      `${product.name}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "products", product.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", error.message);
            }
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
