import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");

  const addNewProduct = async () => {
    if (!name || !price || !store) {
      alert("Please fill in all fields.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      store,
      isBought: false,
    };

    const stored = await AsyncStorage.getItem("zakupy");
    const products = stored ? JSON.parse(stored) : [];
    products.unshift(newProduct);
    await AsyncStorage.setItem("zakupy", JSON.stringify(products));

    navigation.goBack("Home");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Store"
        value={store}
        onChangeText={setStore}
        style={styles.input}
      />
      <Button title="Save" onPress={addNewProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
});
