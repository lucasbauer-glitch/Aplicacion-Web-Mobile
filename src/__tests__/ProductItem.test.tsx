import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import ProductItem from "../components/ProductItem";

describe("ProductItem - Componente Reutilizable", () => {
  it("renderiza el nombre del producto correctamente", () => {
    render(<ProductItem name="Leche Descremada" onDelete={jest.fn()} />);
    expect(screen.getByText("Leche Descremada")).toBeTruthy();
  });

  it("llama a la función onDelete al presionar el botón de eliminar", () => {
    const mockDelete = jest.fn();
    render(<ProductItem name="Yerba Mate" onDelete={mockDelete} />);

    const deleteBtn = screen.getByTestId("delete-button");
    fireEvent.press(deleteBtn);

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});