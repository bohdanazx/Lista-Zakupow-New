// AddProductScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");

  const addNewProduct = async () => {
    if (!name || !price || !store) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        store,
        isBought: false,
        userId: auth.currentUser.uid,
        createdAt: Date.now(),
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error saving product", error.message);
    }
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
