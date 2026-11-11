import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: string;
  name: string;
  imageUri?: string | null;
  location?: { latitude: number; longitude: number } | null;
  supplierContact?: string | null;
  hasCalendarReminder?: boolean;
  reminderDate?: string | null;
}

interface ProductState {
  products: Product[];
  loadProducts: (userEmail: string) => Promise<void>;
  addProduct: (userEmail: string, product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (userEmail: string, updatedProduct: Product) => Promise<void>;
  deleteProduct: (userEmail: string, id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],

  loadProducts: async (userEmail: string) => {
    try {
      const data = await AsyncStorage.getItem(`@list_${userEmail}`);
      if (data) {
        set({ products: JSON.parse(data) });
      } else {
        set({ products: [] });
      }
    } catch (error) {
      console.error("Error al cargar productos desde Zustand:", error);
    }
  },

  addProduct: async (userEmail: string, productData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
    };
    const updatedList = [...get().products, newProduct];
    set({ products: updatedList });
    await AsyncStorage.setItem(`@list_${userEmail}`, JSON.stringify(updatedList));
  },

  updateProduct: async (userEmail: string, updatedProduct: Product) => {
    const updatedList = get().products.map((item) =>
      item.id === updatedProduct.id ? updatedProduct : item
    );
    set({ products: updatedList });
    await AsyncStorage.setItem(`@list_${userEmail}`, JSON.stringify(updatedList));
  },

  deleteProduct: async (userEmail: string, id: string) => {
    const updatedList = get().products.filter((item) => item.id !== id);
    set({ products: updatedList });
    await AsyncStorage.setItem(`@list_${userEmail}`, JSON.stringify(updatedList));
  },
}));