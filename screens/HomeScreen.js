// HomeScreen.js
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
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filterStore, setFilterStore] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "products"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const toggleBought = async (id, current) => {
    await updateDoc(doc(db, "products", id), {
      isBought: !current,
    });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  const filtered = products.filter((p) =>
    filterStore
      ? p.store.toLowerCase().includes(filterStore.toLowerCase())
      : true
  );

  const sections = [
    { title: "To Buy", data: filtered.filter((p) => !p.isBought) },
    { title: "Bought", data: filtered.filter((p) => p.isBought) },
  ];

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace("Login"))
      .catch((error) => alert("Logout failed: " + error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <Button
          title="Add Product"
          onPress={() => navigation.navigate("AddProduct")}
        />
        <Button title="Log Out" color="gray" onPress={handleLogout} />
      </View>

      <TextInput
        placeholder="Filter by store"
        style={styles.input}
        value={filterStore}
        onChangeText={setFilterStore}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
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
              <TouchableOpacity
                onPress={() => toggleBought(item.id, item.isBought)}
              >
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
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
