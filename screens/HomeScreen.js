// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filterStore, setFilterStore] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const data = await AsyncStorage.getItem("zakupy");
        if (data) setProducts(JSON.parse(data));
      };
      loadData();
    }, [])
  );

  useEffect(() => {
    AsyncStorage.setItem("zakupy", JSON.stringify(products));
  }, [products]);

  const toggleBought = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBought: !item.isBought } : item
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = products.filter((p) =>
    filterStore
      ? p.store.toLowerCase().includes(filterStore.toLowerCase())
      : true
  );

  const sections = [
    { title: "Nie kupione", data: filtered.filter((p) => !p.isBought) },
    { title: "Kupione", data: filtered.filter((p) => p.isBought) },
  ];

  return (
    <View style={styles.container}>
      <Button
        title="Dodaj produkt"
        onPress={() => navigation.navigate("AddProduct")}
      />

      <TextInput
        placeholder="Filtruj po sklepie"
        style={styles.input}
        value={filterStore}
        onChangeText={setFilterStore}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate("ProductDetail", { product: item })
              }
            >
              <Text>{item.name}</Text>
              <Text style={styles.small}>
                {item.store} | {item.price} zł
              </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => toggleBought(item.id)}>
                <Text style={{ color: item.isBought ? "green" : "blue" }}>
                  {item.isBought ? "✅" : "🛒"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={{ color: "red", marginLeft: 10 }}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  header: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  item: {
    padding: 10,
    backgroundColor: "#f3f3f3",
    marginVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  small: { fontSize: 12, color: "gray" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
});
