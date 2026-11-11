import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts/legacy';
import * as Calendar from 'expo-calendar/legacy';
import { Alert } from 'react-native';

export type PermissionType = 'camera' | 'gallery' | 'location' | 'contacts' | 'calendar';

export async function requestDevicePermission(type: PermissionType): Promise<boolean> {
  try {
    let status = 'undetermined';

    switch (type) {
      case 'camera': {
        const res = await ImagePicker.requestCameraPermissionsAsync();
        status = res.status;
        break;
      }
      case 'gallery': {
        const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = res.status;
        break;
      }
      case 'location': {
        const res = await Location.requestForegroundPermissionsAsync();
        status = res.status;
        break;
      }
      case 'contacts': {
        const res = await Contacts.requestPermissionsAsync();
        status = res.status;
        break;
      }
      case 'calendar': {
        const res = await Calendar.requestCalendarPermissionsAsync();
        status = res.status;
        break;
      }
    }

    if (status === 'granted') {
      return true;
    } else {
      Alert.alert(
        'Permiso Requerido',
        `El permiso para acceder a ${type} fue rechazado. Habilítalo en la configuración para usar esta función en tu lista de compras.`,
        [{ text: 'OK' }]
      );
      return false;
    }
  } catch (error) {
    console.error(`Error al solicitar permiso de ${type}:`, error);
    Alert.alert('Error', 'Ocurrió un error al solicitar los permisos del dispositivo.');
    return false;
  }
}