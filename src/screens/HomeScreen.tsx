import React, { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList, Modal, Image, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useProductStore, Product } from "../store/useProductStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const { userEmail, logout } = useAuth();
  const { products, loadProducts, deleteProduct } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (userEmail) {
        loadProducts(userEmail);
      }
    }, [userEmail])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (userEmail) {
              await deleteProduct(userEmail, id);
              setModalVisible(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Compras</Text>
      <Text style={styles.userText}>Usuario: {userEmail}</Text>

      <View style={styles.mainButtonContainer}>
        <Button
          title="Agregar Producto"
          onPress={() => navigation.navigate("AddProduct", { productToEdit: undefined })}
          color="#0056b3"
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardInfo}
              onPress={() => {
                setSelectedProduct(item);
                setModalVisible(true);
              }}
            >
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>Sin foto</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.hintText}>Toca para ver detalles</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.textButton}
                onPress={() => navigation.navigate("AddProduct", { productToEdit: item })}
              >
                <Text style={styles.actionEditText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textButton}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay productos agregados.</Text>}
      />

      <View style={styles.logoutContainer}>
        <Button title="Cerrar Sesión" color="#6c757d" onPress={logout} />
      </View>

      {/*MODAL DE DETALLES*/}
      {selectedProduct && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>

              {selectedProduct.imageUri ? (
                <Image source={{ uri: selectedProduct.imageUri }} style={styles.modalImage} />
              ) : (
                <View style={styles.modalPlaceholder}><Text style={styles.placeholderText}>Sin imagen</Text></View>
              )}

              <Text style={styles.modalText}>
                Ubicación: {selectedProduct.location ? `Lat: ${selectedProduct.location.latitude.toFixed(2)}, Lon: ${selectedProduct.location.longitude.toFixed(2)}` : "No registrada"}
              </Text>

              <Text style={styles.modalText}>
                Proveedor: {selectedProduct.supplierContact || "No asignado"}
              </Text>

              <Text style={styles.modalText}>
                Recordatorio: {selectedProduct.reminderDate ? new Date(selectedProduct.reminderDate).toLocaleString() : (selectedProduct.hasCalendarReminder ? "Agendado" : "Sin recordatorio")}
              </Text>

              <View style={styles.modalButtonSpacer}>
                <Button
                  title="Editar Datos"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("AddProduct", { productToEdit: selectedProduct });
                  }}
                  color="#0056b3"
                />
              </View>

              <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#6c757d" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: "#fdfdfd" },
  header: { fontSize: 22, fontWeight: "600", textAlign: "center", color: "#333" },
  userText: { textAlign: "center", color: "#777", marginBottom: 15, fontSize: 13 },
  mainButtonContainer: { marginBottom: 15 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e5e5"
  },
  cardInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  thumbnail: { width: 40, height: 40, borderRadius: 4 },
  placeholderImage: { width: 40, height: 40, borderRadius: 4, backgroundColor: "#eaeaea", justifyContent: "center", alignItems: "center" },
  placeholderText: { fontSize: 10, color: "#888" },
  productName: { fontSize: 15, fontWeight: "500", color: "#222" },
  hintText: { fontSize: 11, color: "#0056b3", marginTop: 2 },
  actionButtons: { flexDirection: "row", alignItems: "center" },
  textButton: { paddingHorizontal: 8, paddingVertical: 4 },
  actionEditText: { fontSize: 13, color: "#0056b3", fontWeight: "500" },
  actionDeleteText: { fontSize: 13, color: "#d9534f", fontWeight: "500" },
  logoutContainer: { marginTop: 10, marginBottom: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 8, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, elevation: 4 },
  modalTitle: { fontSize: 20, fontWeight: "600", marginBottom: 15, color: "#222" },
  modalImage: { width: 120, height: 120, borderRadius: 6, marginBottom: 15 },
  modalPlaceholder: { width: 120, height: 120, borderRadius: 6, backgroundColor: "#eaeaea", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  modalText: { fontSize: 13, color: "#555", marginBottom: 6, textAlign: "center" },
  modalButtonSpacer: { width: "100%", marginBottom: 10, marginTop: 10 }
});