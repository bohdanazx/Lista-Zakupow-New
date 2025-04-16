// screens/ProductDetailScreen.js
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
    navigation.navigate("Home");
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
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!product) {
    return <Text>Brak danych o produkcie</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.text}>Cena: {product.price} zł</Text>
      <Text style={styles.text}>Sklep: {product.store}</Text>
      <Text style={styles.text}>
        Status: {product.isBought ? "Kupione" : "Nie kupione"}
      </Text>

      <View style={{ marginVertical: 20 }}>
        <Button
          title={
            product.isBought ? "Oznacz jako niekupione" : "Oznacz jako kupione"
          }
          onPress={toggleBought}
        />
      </View>

      <Button title="🗑 Usuń produkt" color="red" onPress={deleteProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 6 },
});
