import express from 'express';
import { authController } from '../controllers/authController.js';
import { validate } from '../middlewares/validator.js';
import { loginSchema } from '../utils/schemas.js';
import { authenticate } from '../middlewares/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Aumentado para desarrollo
  message: { success: false, error: 'Too many login attempts, please try again later' }
});

router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
