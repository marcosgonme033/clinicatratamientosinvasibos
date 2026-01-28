import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const clientService = {
  getAll: async (search = '') => {
    const response = await api.get('/clients', { params: { search } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  getSessions: async (id) => {
    const response = await api.get(`/clients/${id}/sessions`);
    return response.data;
  }
};

export const sessionService = {
  getById: async (id) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  create: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  update: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  }
};
