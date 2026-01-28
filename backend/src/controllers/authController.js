import { authService } from '../services/authService.js';

export const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
      }

      const result = await authService.login(email, password);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('[LOGIN ERROR]:', error.message);
      next(error);
    }
  },

  me: async (req, res, next) => {
    try {
      const user = await authService.me(req.user.id);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
};
