import { Router }  from 'express'
import { login, register, verifyProfile } from '../controllers/auth.controller.js';

const router = Router();


router.post('/register',register );
router.post('/login', login);
router.get('/verify-profile',verifyProfile );
router.post('/forget-password', );
router.post('/reset-password', );

export default router 
