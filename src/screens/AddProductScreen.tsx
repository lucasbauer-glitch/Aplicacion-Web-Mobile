import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, Switch, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useLocalNotification } from "../hooks/useLocalNotification";
import { requestDevicePermission } from '../utils/permissions';
import { useProductStore } from "../store/useProductStore";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts/legacy';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar/legacy';

type Props = NativeStackScreenProps<RootStackParamList, "AddProduct">;

export default function AddProductScreen({ route, navigation }: Props) {
  const { userEmail } = useAuth();
  const { addProduct, updateProduct } = useProductStore();

  const productToEdit = route.params?.productToEdit;

  const [productName, setProductName] = useState(productToEdit ? productToEdit.name : "");
  const { dispararNotificacion } = useLocalNotification();
  const [imageUri, setImageUri] = useState<string | null>(productToEdit ? productToEdit.imageUri : null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(productToEdit ? productToEdit.location : null);
  const [supplierContact, setSupplierContact] = useState<string | null>(productToEdit ? productToEdit.supplierContact : null);

  const [reminderDate, setReminderDate] = useState<Date | null>(
    productToEdit?.reminderDate ? new Date(productToEdit.reminderDate) : null
  );
  const [includeCalendarReminder, setIncludeCalendarReminder] = useState<boolean>(productToEdit?.hasCalendarReminder || false);

  const handleGetLocation = async () => {
    const hasPermission = await requestDevicePermission('location');
    if (!hasPermission) return;

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      Alert.alert("Ubicación", "Comercio geolocalizado con éxito.");
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
    }
  };

  const handleSelectContact = async () => {
    const hasPermission = await requestDevicePermission('contacts');
    if (!hasPermission) return;

    try {
      const contact = await Contacts.presentContactPickerAsync();
      if (contact) {
        const contactName = contact.name || 'Sin nombre';
        setSupplierContact(contactName);
        Alert.alert("Proveedor seleccionado", `Seleccionaste a: ${contactName}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo abrir el selector de contactos.");
    }
  };

  const showDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: reminderDate instanceof Date ? reminderDate : new Date(),
      mode: 'date',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          const currentDate = selectedDate;
          DateTimePickerAndroid.open({
            value: currentDate,
            mode: 'time',
            is24Hour: true,
            onChange: (timeEvent, selectedTime) => {
              if (timeEvent.type === 'set' && selectedTime) {
                const finalDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                setReminderDate(finalDate);
                setIncludeCalendarReminder(true);
              }
            },
          });
        }
      },
    });
  };

  const handlePickImage = async (useCamera: boolean) => {
    const permissionType = useCamera ? 'camera' : 'gallery';
    const hasPermission = await requestDevicePermission(permissionType);
    if (!hasPermission) return;

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.8 });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!productName.trim()) {
      Alert.alert("Error", "Debe ingresar el nombre del producto.");
      return;
    }

    let hasCalendarReminder = productToEdit ? productToEdit.hasCalendarReminder : false;

    try {
      if (includeCalendarReminder) {
        const hasCalendarPermission = await requestDevicePermission('calendar');
        if (hasCalendarPermission) {
          const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          const defaultCalendar = calendars.find(cal => cal.source && cal.source.name === 'Default') || calendars[0];

          if (defaultCalendar) {
            let notesDetails = `Producto: ${productName.trim()}`;
            if (supplierContact) notesDetails += `\nProveedor: ${supplierContact}`;

            const startDate = reminderDate instanceof Date ? reminderDate : new Date(Date.now() + 3600000);
            const endDate = new Date(startDate.getTime() + 30 * 60000);

            await Calendar.createEventAsync(defaultCalendar.id, {
              title: `Comprar: ${productName.trim()}`,
              notes: notesDetails,
              startDate,
              endDate,
              timeZone: 'GMT',
            });

            hasCalendarReminder = true;
          }
        }
      }

      if (userEmail) {
        const dateToSave = reminderDate instanceof Date ? reminderDate.toISOString() : (productToEdit?.reminderDate || null);

        if (productToEdit) {
          await updateProduct(userEmail, {
            id: productToEdit.id,
            name: productName.trim(),
            imageUri,
            location,
            supplierContact,
            hasCalendarReminder,
            reminderDate: dateToSave,
          });
        } else {
          await addProduct(userEmail, {
            name: productName.trim(),
            imageUri,
            location,
            supplierContact,
            hasCalendarReminder,
            reminderDate: dateToSave,
          });
          await dispararNotificacion(productName.trim());
        }
      }

      Alert.alert("Éxito", productToEdit ? "Producto actualizado." : "Producto guardado.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el producto.");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{productToEdit ? "Editar Producto" : "Nuevo Producto"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        placeholderTextColor="#888"
        value={productName}
        onChangeText={setProductName}
      />

      <View style={styles.buttonRow}>
        <View style={styles.halfButton}><Button title="Tomar Foto" onPress={() => handlePickImage(true)} color="#495057" /></View>
        <View style={styles.halfButton}><Button title="Galería" onPress={() => handlePickImage(false)} color="#495057" /></View>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <View style={styles.sectionSpacer}>
        <Button title="Seleccionar Proveedor" onPress={handleSelectContact} color="#495057" />
        {supplierContact && <Text style={styles.infoText}>Proveedor: {supplierContact}</Text>}
      </View>

      <View style={styles.sectionSpacer}>
        <Button title="Obtener Ubicación" onPress={handleGetLocation} color="#495057" />
        {location && <Text style={styles.infoText}>Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</Text>}
      </View>

      <View style={styles.sectionSpacer}>
        <Button title="Elegir Fecha de Recordatorio" onPress={showDatePickerAndroid} color="#495057" />
        <Text style={styles.infoText}>
          {reminderDate instanceof Date ? `Programado: ${reminderDate.toLocaleString()}` : "Sin recordatorio programado"}
        </Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Guardar en el Calendario</Text>
        <Switch value={includeCalendarReminder} onValueChange={setIncludeCalendarReminder} />
      </View>

      <View style={styles.mainActionContainer}>
        <Button title={productToEdit ? "Actualizar" : "Guardar"} onPress={handleSave} color="#0056b3" />
        <View style={{ height: 10 }} />
        <Button title="Cancelar" color="#6c757d" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 6, color: "#000" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  halfButton: { width: "48%" },
  imagePreview: { width: 90, height: 90, alignSelf: "center", marginBottom: 15, borderRadius: 6 },
  sectionSpacer: { marginBottom: 15 },
  infoText: { textAlign: "center", color: "#555", marginTop: 4, fontSize: 12 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10, paddingHorizontal: 2 },
  switchLabel: { fontSize: 14, color: "#333" },
  mainActionContainer: { marginTop: 20 }
});