import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import ProductItem from "../components/ProductItem";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { userEmail, logout } = useAuth();
  const [items, setItems] = useState<string[]>([]);

  const loadItems = async () => {
    try {
      const data = await AsyncStorage.getItem(`@list_${userEmail}`);
      if (data) setItems(JSON.parse(data));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [userEmail])
  );

  const deleteItem = async (indexToDelete: number) => {
    const updated = items.filter((_, index) => index !== indexToDelete);
    setItems(updated);
    await AsyncStorage.setItem(`@list_${userEmail}`, JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Lista de Compras</Text>
      <Text style={styles.userText}>Usuario: {userEmail}</Text>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ProductItem name={item} onDelete={() => deleteItem(index)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos agregados.</Text>}
      />

      <View style={styles.buttonGroup}>
        <Button title="+ Agregar Producto" onPress={() => navigation.navigate("AddProduct")} />
        <View style={{ height: 10 }} />
        <Button title="Cerrar Sesión" color="#FF3B30" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  userText: { textAlign: "center", color: "#666", marginBottom: 15, marginTop: 5 },
  empty: { textAlign: "center", color: "#aaa", marginTop: 40 },
  buttonGroup: { marginTop: 10, marginBottom: 10 },
});