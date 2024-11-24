import { Router }  from 'express'
import { register } from '../controllers/auth.controller.js';

const router = Router();


router.post('/register',register );
router.post('/login', );
router.get('/verify-email', );
router.post('/forget-password', );
router.post('/reset-password', );

export default router 
