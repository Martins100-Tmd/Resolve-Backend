import { Router } from 'express';
import { CollectDetails } from '../controller/waitlist';

const router = Router();

router.post('/collectemail', CollectDetails );


export default router;

