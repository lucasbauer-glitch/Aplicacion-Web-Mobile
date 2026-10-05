import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import AddProductScreen from "../screens/AddProductScreen";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ userEmail: "test@mail.com" }),
}));

jest.mock("../hooks/useLocalNotification", () => ({
  useLocalNotification: () => ({
    dispararNotificacion: jest.fn(),
  }),
}));

describe("AddProductScreen - Interacción", () => {
  const mockNavigation: any = { goBack: jest.fn() };

  it("renderiza el título y el campo de texto", () => {
    render(<AddProductScreen navigation={mockNavigation} route={{} as any} />);
    expect(screen.getByText("Nuevo Producto")).toBeTruthy();
    expect(screen.getByPlaceholderText("Ej: Leche, Yerba, Pan...")).toBeTruthy();
  });

  it("permite escribir en el campo de texto del producto", () => {
    render(<AddProductScreen navigation={mockNavigation} route={{} as any} />);
    const input = screen.getByPlaceholderText("Ej: Leche, Yerba, Pan...");

    fireEvent.changeText(input, "Fideos");
    expect(input.props.value).toBe("Fideos");
  });
});