import express from 'express';
import validation from '../../middleware/validation/auth';
import verifyToken from '../../middleware/verifyToken';

import login from './login';
import password from './password';
import signup from './signup';
import updateUser from './updateUser';

const router = express.Router();

router.post('/login', [validation.auth, login]);
router.post('/signup', [validation.auth, signup]);
router.patch('/updateUser', [verifyToken, updateUser]);
router.patch('/password', [verifyToken, password]);

export default router;
