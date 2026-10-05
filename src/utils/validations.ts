export function validateProduct(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: "El nombre del producto no puede estar vacío." };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "El nombre debe tener al menos 2 caracteres." };
  }
  return { isValid: true };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}