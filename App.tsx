import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  console.log("[App] iniciando aplicación");

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

