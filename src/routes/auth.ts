import { Router, RequestHandler } from 'express';
import {
	login,
	register,
	forgotPassword,
	resetPassword,
	checkRegistrationEmail,
} from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
	checkRegistrationEmailSchema,
} from '../validators/authSchemas';

const router = Router();

router.post('/login', validateBody(loginSchema), login as RequestHandler);
router.post(
	'/check-email',
	validateBody(checkRegistrationEmailSchema),
	checkRegistrationEmail as RequestHandler
);
router.post('/register', validateBody(registerSchema), register as RequestHandler);
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword as RequestHandler);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword as RequestHandler);

export default router;