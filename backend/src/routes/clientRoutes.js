import express from 'express';
import { clientController } from '../controllers/clientController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { clientSchema } from '../utils/schemas.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'clinica'), clientController.getAll);
router.get('/:id', authenticate, authorize('admin', 'clinica'), clientController.getById);
router.post('/', authenticate, authorize('admin', 'clinica'), validate(clientSchema), clientController.create);
router.put('/:id', authenticate, authorize('admin', 'clinica'), validate(clientSchema), clientController.update);
router.get('/:id/sessions', authenticate, authorize('admin', 'clinica'), clientController.getSessions);

export default router;
