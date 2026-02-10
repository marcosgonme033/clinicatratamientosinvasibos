import { query } from '../config/database.js';

export const sessionRepository = {
  findById: async (id) => {
    const sessions = await query('SELECT * FROM sessions WHERE id = ?', [id]);
    return sessions[0] || null;
  },

  create: async (sessionData) => {
    const result = await query(
      `INSERT INTO sessions (client_id, fecha, profesional, tratamiento, zona, 
                             cantidad, observaciones, incidencias, proxima_revision, 
                             injection_points, products_used) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionData.client_id,
        sessionData.fecha,
        sessionData.profesional,
        sessionData.tratamiento,
        sessionData.zona || null,
        sessionData.cantidad != null ? sessionData.cantidad : null,
        sessionData.observaciones || null,
        sessionData.incidencias || null,
        sessionData.proxima_revision || null,
        typeof sessionData.injection_points === 'string' ? sessionData.injection_points : JSON.stringify(sessionData.injection_points || []),
        sessionData.products_used || null
      ]
    );
    return result.insertId;
  },

  update: async (id, sessionData) => {
    const result = await query(
      `UPDATE sessions 
       SET client_id = ?, fecha = ?, profesional = ?, tratamiento = ?, zona = ?, 
           cantidad = ?, observaciones = ?, incidencias = ?, proxima_revision = ?,
           injection_points = ?, products_used = ?
       WHERE id = ?`,
      [
        sessionData.client_id,
        sessionData.fecha,
        sessionData.profesional,
        sessionData.tratamiento,
        sessionData.zona || null,
        sessionData.cantidad != null ? sessionData.cantidad : null,
        sessionData.observaciones || null,
        sessionData.incidencias || null,
        sessionData.proxima_revision || null,
        typeof sessionData.injection_points === 'string' ? sessionData.injection_points : JSON.stringify(sessionData.injection_points || []),
        sessionData.products_used || null,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const result = await query('DELETE FROM sessions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
