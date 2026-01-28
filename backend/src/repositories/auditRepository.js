import { query } from '../config/database.js';

export const auditRepository = {
  create: async (userId, action, entity, entityId, metadata = {}) => {
    const result = await query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, metadata) VALUES (?, ?, ?, ?, ?)',
      [userId, action, entity, entityId, JSON.stringify(metadata)]
    );
    return result.insertId;
  },

  findByEntity: async (entity, entityId) => {
    return await query(
      'SELECT * FROM audit_logs WHERE entity = ? AND entity_id = ? ORDER BY created_at DESC',
      [entity, entityId]
    );
  }
};
