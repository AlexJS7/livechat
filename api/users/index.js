import express from 'express';
import verifyToken from '../../middleware/verifyToken';

import get from './get';

const router = express.Router();

router.get('/get', [verifyToken, get]);

export default router;
