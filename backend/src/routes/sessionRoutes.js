import express from 'express';
import { sessionController } from '../controllers/sessionController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { sessionSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/:id', authenticate, authorize('admin', 'clinica'), sessionController.getById);
router.post('/', authenticate, authorize('admin', 'clinica'), validate(sessionSchema), sessionController.create);
router.put('/:id', authenticate, authorize('admin', 'clinica'), validate(sessionSchema), sessionController.update);
router.delete('/:id', authenticate, authorize('admin'), sessionController.delete);

export default router;
