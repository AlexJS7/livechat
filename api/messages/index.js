import express from 'express';
import verifyToken from '../../middleware/verifyToken';

import create from './create';
import inbound from './inbound';
import outbound from './outbound';
import get from './get';
import last from './last';


const router = express.Router();

router.post('/create', [verifyToken, create]);
router.post('/inbound', inbound);
router.post('/outbound', outbound);
router.get('/:threadId/get', [verifyToken, get]);
router.get('/last', [verifyToken, last]);

export default router;
