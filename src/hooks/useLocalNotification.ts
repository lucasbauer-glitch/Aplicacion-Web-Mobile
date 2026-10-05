import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

// Actualizado a la sintaxis moderna recomendada por expo-notifications
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useLocalNotification() {
  const requestPermissionAndSetup = useCallback(async () => {
    // Configuración segura del canal en Android (atrapando limitaciones de Expo Go)
    if (Platform.OS === 'android') {
      try {
        await setNotificationChannelAsync('compras', {
          name: 'Recordatorios de Compras',
          importance: AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#34C759',
          sound: 'default',
        });
      } catch {
        // En emuladores o Expo Go reciente este proveedor puede ser nulo; se ignora de forma segura
      }
    }

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }, []);

  useEffect(() => {
    requestPermissionAndSetup();
  }, [requestPermissionAndSetup]);

  const dispararNotificacion = useCallback(async (producto: string) => {
    try {
      const hasPermission = await requestPermissionAndSetup();
      if (!hasPermission && Platform.OS !== 'web') {
        console.warn('[Notif] Permisos denegados');
        return;
      }

      await scheduleNotificationAsync({
        content: {
          title: '🛒 Recordatorio de Compra',
          body: `¡Agregaste "${producto}" a tu lista de compras!`,
          sound: 'default',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });
      console.log('[Notif] Notificación programada a los 2 segundos');
    } catch (error) {
      console.warn('[Notif] Error al lanzar notificación:', error);
    }
  }, [requestPermissionAndSetup]);

  return { dispararNotificacion };
}