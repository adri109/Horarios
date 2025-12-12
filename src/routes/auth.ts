import { Router, Request, Response, RequestHandler } from 'express';
import { login, register, forgotPassword, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);
router.post('/forgot-password', forgotPassword as RequestHandler);
router.post('/reset-password', resetPassword as RequestHandler);

export default router;