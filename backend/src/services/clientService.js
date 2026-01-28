import { clientRepository } from '../repositories/clientRepository.js';
import { auditRepository } from '../repositories/auditRepository.js';

export const clientService = {
  getAll: async (search) => {
    return await clientRepository.findAll(search);
  },

  getById: async (id) => {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  },

  create: async (clientData, userId) => {
    const existing = await clientRepository.findByExpediente(clientData.expediente);
    if (existing) {
      throw new Error('Expediente already exists');
    }

    const clientId = await clientRepository.create(clientData);
    
    await auditRepository.create(
      userId,
      'CREATE_CLIENT',
      'client',
      clientId,
      { expediente: clientData.expediente, nombre: clientData.nombre }
    );

    return await clientRepository.findById(clientId);
  },

  update: async (id, clientData, userId) => {
    const client = await clientRepository.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    if (clientData.expediente !== client.expediente) {
      const existing = await clientRepository.findByExpediente(clientData.expediente);
      if (existing) {
        throw new Error('Expediente already exists');
      }
    }

    const success = await clientRepository.update(id, clientData);
    
    if (success) {
      await auditRepository.create(
        userId,
        'UPDATE_CLIENT',
        'client',
        id,
        { expediente: clientData.expediente }
      );
    }

    return await clientRepository.findById(id);
  },

  getSessions: async (clientId) => {
    const client = await clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    return await clientRepository.getSessions(clientId);
  }
};
