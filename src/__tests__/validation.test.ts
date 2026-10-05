import { validateProduct, validateEmail } from "../utils/validations";

describe("Validaciones de Negocio", () => {
  describe("validateProduct", () => {
    it("retorna error si el nombre del producto está vacío o son solo espacios", () => {
      const result = validateProduct("   ");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("El nombre del producto no puede estar vacío.");
    });

    it("retorna error si el producto tiene menos de 2 caracteres", () => {
      const result = validateProduct("A");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("El nombre debe tener al menos 2 caracteres.");
    });

    it("valida exitosamente cuando el producto tiene un nombre correcto", () => {
      const result = validateProduct("Café");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe("validateEmail", () => {
    it("retorna true para un formato de email válido", () => {
      expect(validateEmail("lucas@mail.com")).toBe(true);
    });

    it("retorna false para emails sin arroba o sin dominio", () => {
      expect(validateEmail("lucasmail.com")).toBe(false);
      expect(validateEmail("lucas@")).toBe(false);
    });
  });
});