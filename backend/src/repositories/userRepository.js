import { query } from '../config/database.js';

export const userRepository = {
  findByEmail: async (email) => {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  },

  findById: async (id) => {
    const users = await query('SELECT * FROM users WHERE id = ?', [id]);
    return users[0] || null;
  },

  create: async (userData) => {
    const result = await query(
      'INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      [userData.email, userData.password_hash, userData.role, userData.name]
    );
    return result.insertId;
  },

  getPublicData: (user) => {
    const { password_hash, password, ...publicData } = user;
    return publicData;
  }
};
