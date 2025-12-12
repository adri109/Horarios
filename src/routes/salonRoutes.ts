import { Router } from 'express';
import { getSalonBySlug } from '../controllers/salonController';

const router = Router();

router.get('/:slug', getSalonBySlug);

export default router;
