/** Máscara visual (###) ###-####; el valor de negocio sigue siendo solo dígitos (10). */
export function formatPhoneMask(value: string): string {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
