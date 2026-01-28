import { clientService } from '../services/clientService.js';

export const clientController = {
  getAll: async (req, res, next) => {
    try {
      const { search } = req.query;
      const clients = await clientService.getAll(search);

      res.json({
        success: true,
        data: clients
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const client = await clientService.getById(parseInt(req.params.id));

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const client = await clientService.create(req.body, req.user.id);

      res.status(201).json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const client = await clientService.update(
        parseInt(req.params.id),
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      next(error);
    }
  },

  getSessions: async (req, res, next) => {
    try {
      const sessions = await clientService.getSessions(parseInt(req.params.id));

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      next(error);
    }
  }
};
