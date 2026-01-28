import { sessionService } from '../services/sessionService.js';

export const sessionController = {
  getById: async (req, res, next) => {
    try {
      const session = await sessionService.getById(parseInt(req.params.id));

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      console.log('📝 Creating session with data:', JSON.stringify(req.body, null, 2));
      const session = await sessionService.create(req.body, req.user.id);

      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('❌ Error creating session:', error);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const session = await sessionService.update(
        parseInt(req.params.id),
        req.body,
        req.user.id
      );

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await sessionService.delete(parseInt(req.params.id), req.user.id);

      res.json({
        success: true,
        message: 'Session deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
