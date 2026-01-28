import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository.js';
import { generateToken } from '../config/jwt.js';

const isBcryptHash = (str) => {
  return str && (str.startsWith('$2a$') || str.startsWith('$2b$') || str.startsWith('$2y$'));
};

export const authService = {
  login: async (email, password) => {
    try {
      // Validación de entrada
      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
      }

      console.log(`[AUTH] Login attempt for email: ${email}`);

      const user = await userRepository.findByEmail(email);

      if (!user) {
        console.log(`[AUTH] User not found: ${email}`);
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }

      console.log(`[AUTH] User found: ${email}, ID: ${user.id}`);

      // Validar que password_hash existe y es un hash bcrypt válido
      if (!user.password_hash) {
        console.error(`[AUTH ERROR] User ${email} has NULL password_hash in database`);
        const error = new Error('Internal server error');
        error.statusCode = 500;
        throw error;
      }

      if (!isBcryptHash(user.password_hash)) {
        console.error(`[AUTH ERROR] User ${email} has invalid password_hash (not bcrypt format): ${user.password_hash.substring(0, 20)}...`);
        const error = new Error('Internal server error');
        error.statusCode = 500;
        throw error;
      }

      console.log(`[AUTH] Comparing password for user: ${email}`);
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        console.log(`[AUTH] Invalid password for user: ${email}`);
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
      }

      console.log(`[AUTH] Login successful for user: ${email}`);

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });

      return {
        token,
        user: userRepository.getPublicData(user)
      };
    } catch (error) {
      // Si el error ya tiene statusCode, lo dejamos pasar
      if (error.statusCode) {
        throw error;
      }
      // Si no, es un error inesperado (500)
      console.error('[AUTH ERROR] Unexpected error during login:', error);
      const serverError = new Error('Internal server error');
      serverError.statusCode = 500;
      throw serverError;
    }
  },

  me: async (userId) => {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return userRepository.getPublicData(user);
  }
};
