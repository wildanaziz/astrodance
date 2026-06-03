export function isValidNIM(nim: string): boolean {
  return /^\d{15}$/.test(nim);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
