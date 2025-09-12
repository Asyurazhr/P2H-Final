// lib/password.ts
import bcrypt from 'bcryptjs';

export function hashPassword(password: string): string {
  // Menggunakan bcrypt dengan salt rounds 10
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  try {
    // bcrypt.compareSync akan handle baik $2y$ maupun $2b$ format
    return bcrypt.compareSync(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Fungsi untuk generate hash dari password plain
export function generateHashForPassword(plainPassword: string): string {
  const hash = hashPassword(plainPassword);
  console.log(`Plain: ${plainPassword} -> Hash: ${hash}`);
  return hash;
}
