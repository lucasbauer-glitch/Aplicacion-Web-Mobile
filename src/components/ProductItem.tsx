import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ProductItemProps {
  name: string;
  onDelete: () => void;
}

export default function ProductItem({ name, onDelete }: ProductItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity
        testID="delete-button"
        onPress={onDelete}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});