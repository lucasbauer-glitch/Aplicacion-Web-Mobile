import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ProductItemProps {
  name: string;
  imageUri?: string | null;
  onDelete?: () => void;
}

export default function ProductItem({ name, imageUri, onDelete }: ProductItemProps) {
  return (
    <View style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]} />
      )}

      <Text style={styles.productName}>{name}</Text>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton} testID="delete-button">
          <Text style={styles.deleteText}>❌</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    fontSize: 14,
  },
});