import { query } from '../config/database.js';

export const clientRepository = {
  findAll: async (search = '') => {
    let sql = 'SELECT * FROM clients';
    let params = [];

    if (search) {
      sql += ' WHERE expediente LIKE ? OR nombre LIKE ? OR apellidos LIKE ? OR telefono LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    sql += ' ORDER BY created_at DESC';
    return await query(sql, params);
  },

  findById: async (id) => {
    const clients = await query('SELECT * FROM clients WHERE id = ?', [id]);
    return clients[0] || null;
  },

  findByExpediente: async (expediente) => {
    const clients = await query('SELECT * FROM clients WHERE expediente = ?', [expediente]);
    return clients[0] || null;
  },

  create: async (clientData) => {
    const result = await query(
      `INSERT INTO clients (expediente, nombre, apellidos, telefono, email, fecha_nacimiento, notas_generales) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        clientData.expediente,
        clientData.nombre,
        clientData.apellidos,
        clientData.telefono || null,
        clientData.email || null,
        clientData.fecha_nacimiento || null,
        clientData.notas_generales || null
      ]
    );
    return result.insertId;
  },

  update: async (id, clientData) => {
    const result = await query(
      `UPDATE clients 
       SET expediente = ?, nombre = ?, apellidos = ?, telefono = ?, email = ?, 
           fecha_nacimiento = ?, notas_generales = ?
       WHERE id = ?`,
      [
        clientData.expediente,
        clientData.nombre,
        clientData.apellidos,
        clientData.telefono || null,
        clientData.email || null,
        clientData.fecha_nacimiento || null,
        clientData.notas_generales || null,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM clients WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  getSessions: async (clientId) => {
    return await query(
      'SELECT * FROM sessions WHERE client_id = ? ORDER BY fecha DESC',
      [clientId]
    );
  }
};
