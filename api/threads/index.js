import express from 'express';
import verifyToken from '../../middleware/verifyToken';

import get from './get';
import all from './all';
import create from './create';
import addRep from './addRep';
import changeRep from './changeRep';

const router = express.Router();

router.get('/get', verifyToken, get);
router.post('/create', verifyToken, create);
router.get('/all', verifyToken, all);
router.patch('/addRep', addRep);
router.patch('/changeRep', verifyToken, changeRep);

export default router;
