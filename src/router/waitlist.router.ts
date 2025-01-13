import { Router } from 'express';
import { CollectEmail, GetAllEmail } from '../controller/waitlist';

const router = Router();

router.post('/collectemail', CollectEmail );
router.get('/getallemails', GetAllEmail ); 

export default router;

