# Lista de Compras Inteligente - Parcial 2

Aplicación móvil desarrollada en React Native con Expo (SDK 58) para el Parcial 2 de la materia Aplicaciones Móviles.

---

## Información General

- **Alumno:** Lucas Bauer
- **Opción elegida:** Lista de compras inteligente
- **Docente:** Martín Cornejo (`martin.cornejo@istea.com.ar`)
- **Fecha de Entrega:** 10/11/2026

---

## Video DEMO

- **Enlace al video:** [https://youtube.com/shorts/JbSnZcscgLY](https://youtu.be/TU_ENLACE_AQUI) *(Duración: < 2 minutos)*

---

## Funcionalidades Implementadas

La aplicación cumple con todos los requisitos técnicos obligatorios de la consigna y expande las capacidades con módulos avanzados:

1. **Componentes y Estilos:**
    - Uso de componentes nativos esenciales: `View`, `Text`, `TextInput`, `Button`, `TouchableOpacity` y `Modal`.
    - Estilización modular sobria con `StyleSheet` y paleta unificada.
    - Componente reutilizable propio: `ProductItem.tsx` para representar cada producto de la lista.

2. **Navegación:**
    - Implementada con React Navigation (`@react-navigation/native-stack`).
    - Flujo completo de pantallas:
        - `LoginScreen`: Inicio de sesión.
        - `RegisterScreen`: Registro de nuevos usuarios.
        - `HomeScreen`: Pantalla principal con la lista de compras del usuario autenticado, modal de consulta y accesos rápidos de edición y eliminación.
        - `AddProductScreen`: Formulario dinámico inteligente para el alta y actualización de productos.

3. **Autenticación Local:**
    - Manejo global de sesión mediante `AuthContext`.
    - Registro y Login validados localmente contra `AsyncStorage` (sin backend ni servicios externos).
    - Restricción estricta de navegación: no es posible acceder a las pantallas principales sin iniciar sesión.

4. **Persistencia y Estado Global (Zustand):**
    - Gestión centralizada del estado mediante Zustand (`useProductStore.ts`) sincronizado con `@react-native-async-storage/async-storage`.
    - Aislamiento total de credenciales y listas de productos por cuenta de usuario.
    - Funcionalidades CRUD completas: crear, leer, editar y eliminar productos con persistencia local.

5. **Módulos y Permisos Nativos Avanzados:**
    - **Cámara y Galería (`expo-image-picker`):** Captura o selección de fotografías adjuntas al producto.
    - **Geolocalización GPS (`expo-location`):** Obtención de coordenadas en tiempo real del comercio o punto de compra.
    - **Contactos (`expo-contacts/legacy`):** Selector nativo para asociar un proveedor o contacto de la libreta.
    - **Calendario (`expo-calendar/legacy`):** Creación automática de eventos con fecha y hora personalizada mediante selector nativo de Android (`DateTimePickerAndroid`).
    - **Notificaciones Locales:** Alertas automáticas mediante `expo-notifications` al registrar un nuevo producto.

6. **Testing Unitario con Jest:**
    - Configuración con Jest y React Native Testing Library (RNTL).
    - Suite de pruebas automatizadas:
        - Test de componente reutilizable (`ProductItem.test.tsx`): renderizado e interacción con eventos.
        - Test de lógica de negocio (`validation.test.ts`): validación de nombres de producto y formato de email.
        - Test de pantalla e interacción (`AddProductScreen.test.tsx`): renderizado de inputs y captura de eventos.

---

## Tecnologías Utilizadas

- **Framework:** React Native con Expo (SDK 58)
- **Lenguaje:** TypeScript
- **Estado Global:** Zustand
- **Navegación:** `@react-navigation/native` & `@react-navigation/native-stack`
- **Persistencia:** `@react-native-async-storage/async-storage`
- **Módulos Nativos:** `expo-image-picker`, `expo-location`, `expo-contacts`, `expo-calendar`, `@react-native-community/datetimepicker`, `expo-notifications`
- **Testing:** `jest`, `jest-expo`, `@testing-library/react-native`

---

## Instrucciones de Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ListaDeCompras