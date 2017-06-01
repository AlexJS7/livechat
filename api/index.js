import express from 'express';
import multer from 'multer';

import auth from './auth';
import users from './users';
import threads from './threads';
import messages from './messages';
import upload from './upload';

const router = express.Router();

const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});

router.use('/auth', auth);
router.use('/users', users);
router.use('/threads', threads);
router.use('/messages', messages);

router.put('/upload/:threadId', fileUpload.single('file'), upload);

export default router;
