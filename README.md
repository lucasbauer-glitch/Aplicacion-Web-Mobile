# Lista de Compras Inteligente - Parcial 1

Aplicación móvil desarrollada en **React Native** con **Expo** para el Parcial 1 de la materia **Aplicaciones Móviles**.

---

##  Información General

* **Alumno:** Lucas
* **Opción elegida:**  Lista de compras inteligente
* **Docente:** Martín Cornejo (`martin.cornejo@istea.com.ar`)
* **Fecha de Entrega:** 06/10/2026

---

## Video DEMO

* **Enlace al video:** [https://drive.google.com/file/d/1-J7qv8MzUnDPpzPtGYtYGGgTnwwfOxMH/view?usp=sharing](https://youtu.be/TU_ENLACE_AQUI) *(Duración: < 1 minuto)*

---

## Funcionalidades Implementadas

La aplicación cumple con todos los requisitos técnicos obligatorios de la consigna:

1. **Componentes y Estilos:**
   * Uso de componentes nativos esenciales: `View`, `Text`, `TextInput`, `Button` y `TouchableOpacity`.
   * Estilización modular con `StyleSheet`.
   * Componente reutilizable propio: `ProductItem.tsx` para representar y gestionar cada producto de la lista.

2. **Navegación:**
   * Implementada con **React Navigation** (`@react-navigation/native-stack`).
   * Flujo completo de 4 pantallas obligatorias:
      * `LoginScreen`: Inicio de sesión.
      * `RegisterScreen`: Registro de nuevos usuarios.
      * `HomeScreen`: Pantalla principal con la lista de compras del usuario autenticado.
      * `AddProductScreen`: Formulario de alta para nuevos productos.

3. **Autenticación Local:**
   * Manejo global de sesión mediante `AuthContext`.
   * Registro y Login validados localmente contra `AsyncStorage` (sin backend ni servicios externos).
   * Restricción estricta de navegación: no es posible acceder a las pantallas principales sin iniciar sesión.

4. **Persistencia y Datos:**
   * Almacenamiento local mediante `@react-native-async-storage/async-storage`.
   * Persistencia de credenciales de usuario y listas de productos aisladas por cuenta.
   * Funcionalidades completas: agregar productos, visualización reactiva con `FlatList`, eliminación individual y persistencia total al cerrar la aplicación.

5. **Notificaciones Locales:**
   * Integración con `expo-notifications` mediante un hook personalizado (`useLocalNotification.ts`).
   * Configuración de permisos y canales nativos para Android.
   * Disparo automático de una notificación local programada al agregar un nuevo producto a la lista.

6. **Testing Unitario con Jest:**
   * Configuración con **Jest** y **React Native Testing Library (RNTL)** sobre React 19.
   * Suite de pruebas automatizadas:
      * Test de componente reutilizable (`ProductItem.test.tsx`): renderizado e interacción con eventos.
      * Test de lógica de negocio (`validation.test.ts`): validación de nombres de producto y formato de email.
      * Test de pantalla e interacción (`AddProductScreen.test.tsx`): renderizado de inputs y captura de eventos.

---

## Tecnologías Utilizadas

* **Framework:** React Native (v0.86.3) con Expo SDK 57
* **Lenguaje:** TypeScript
* **Navegación:** `@react-navigation/native` & `@react-navigation/native-stack` (v7)
* **Persistencia:** `@react-native-async-storage/async-storage`
* **Notificaciones:** `expo-notifications` & `expo-device`
* **Testing:** `jest`, `jest-expo`, `@testing-library/react-native`

---

**Test corrido!**

<img width="1011" height="994" alt="image" src="https://github.com/user-attachments/assets/15e1464d-84c0-4963-868c-56f463486ef0" />
`

## Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd ListaDeCompras
