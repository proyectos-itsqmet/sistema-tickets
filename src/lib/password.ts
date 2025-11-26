import bcrypt from "bcryptjs";

/**
 * Encripta una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promise con la contraseña encriptada
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compara una contraseña en texto plano con su hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Hash de la contraseña almacenada
 * @returns Promise<boolean> - true si coinciden, false si no
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
