import { sessionRepository } from '../repositories/sessionRepository.js';
import { clientRepository } from '../repositories/clientRepository.js';
import { auditRepository } from '../repositories/auditRepository.js';

export const sessionService = {
  getById: async (id) => {
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  },

  create: async (sessionData, userId) => {
    const client = await clientRepository.findById(sessionData.client_id);
    if (!client) {
      throw new Error('Client not found');
    }

    const sessionId = await sessionRepository.create(sessionData);
    
    await auditRepository.create(
      userId,
      'CREATE_SESSION',
      'session',
      sessionId,
      { 
        client_id: sessionData.client_id,
        tratamiento: sessionData.tratamiento,
        zona: sessionData.zona
      }
    );

    return await sessionRepository.findById(sessionId);
  },

  update: async (id, sessionData, userId) => {
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }

    const client = await clientRepository.findById(sessionData.client_id);
    if (!client) {
      throw new Error('Client not found');
    }

    const success = await sessionRepository.update(id, sessionData);
    
    if (success) {
      await auditRepository.create(
        userId,
        'UPDATE_SESSION',
        'session',
        id,
        { tratamiento: sessionData.tratamiento }
      );
    }

    return await sessionRepository.findById(id);
  },

  delete: async (id, userId) => {
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }

    await auditRepository.create(
      userId,
      'DELETE_SESSION',
      'session',
      id,
      { client_id: session.client_id }
    );

    return await sessionRepository.delete(id);
  }
};
