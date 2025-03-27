import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SectionList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");
  const [filterStore, setFilterStore] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("zakupy");
        if (data) setProducts(JSON.parse(data));
      } catch (err) {
        console.log(err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("zakupy", JSON.stringify(products));
      } catch (err) {
        console.log(err);
      }
    };
    saveData();
  }, [products]);

  const addProduct = () => {
    if (!name || !price || !store) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      store,
      isBought: false,
    };
    setProducts([newProduct, ...products]);
    setName("");
    setPrice("");
    setStore("");
  };

  const toggleBought = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBought: !p.isBought } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const byStore = filterStore
      ? p.store.toLowerCase().includes(filterStore.toLowerCase())
      : true;
    return byStore;
  });

  const sections = [
    {
      title: "Nie kupione",
      data: filtered.filter((p) => !p.isBought),
    },
    {
      title: "Kupione",
      data: filtered.filter((p) => p.isBought),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={{ paddingTop: 40 }}>
              <Text style={styles.title}>🛒 Lista Zakupów</Text>

              <TextInput
                placeholder="Nazwa"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Cena"
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Sklep"
                value={store}
                onChangeText={setStore}
                style={styles.input}
              />
              <TouchableOpacity style={styles.button} onPress={addProduct}>
                <Text style={styles.buttonText}>Dodaj produkt</Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Filtruj sklep"
                value={filterStore}
                onChangeText={setFilterStore}
                style={styles.input}
              />
            </View>
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => toggleBought(item.id)}>
                <Text style={[styles.itemText, item.isBought && styles.bought]}>
                  {item.name} - {item.price}zł ({item.store})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={{ color: "red" }}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4630EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: 8,
    marginBottom: 6,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
  },
  bought: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
