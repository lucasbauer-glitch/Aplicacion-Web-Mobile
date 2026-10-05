import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useLocalNotification } from "../hooks/useLocalNotification";

type Props = NativeStackScreenProps<RootStackParamList, "AddProduct">;

export default function AddProductScreen({ navigation }: Props) {
  const { userEmail } = useAuth();
  const [productName, setProductName] = useState("");
  const { dispararNotificacion } = useLocalNotification();

  const handleSave = async () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Escribe el nombre del producto.");
      return;
    }

    try {
      const data = await AsyncStorage.getItem(`@list_${userEmail}`);
      const list = data ? JSON.parse(data) : [];
      list.push(productName.trim());
      await AsyncStorage.setItem(`@list_${userEmail}`, JSON.stringify(list));

      // Disparamos la notificación usando el hook
      await dispararNotificacion(productName.trim());

      Alert.alert("Éxito", "Producto guardado.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el producto.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Producto</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: Leche, Yerba, Pan..."
        value={productName}
        onChangeText={setProductName}
      />

      <Button title="Guardar Producto" onPress={handleSave} color="#34C759" />
      <View style={{ height: 10 }} />
      <Button title="Cancelar" color="#888" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 6 },
});