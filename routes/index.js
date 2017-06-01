import express from 'express';
import multer from 'multer';

import auth from '../controllers/auth';
import chat from '../controllers/chat';
import message from '../controllers/message';
import thread from '../controllers/thread';

import validation from '../middleware/validation/auth';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 52428800 },
});

// auth routes
router.post('/login', [validation.auth, auth.loginUser]);
router.post('/signup', [validation.auth, auth.signUpUser]);
router.patch('/user', [verifyToken, auth.updateUserInfo]);
router.patch('/password', [verifyToken, auth.updateUserPassword]);

// chat routes
router.post('/inbound', chat.inbound);
router.post('/outbound', chat.outbound);

router.put('/upload/:threadId', upload.single('file'), chat.upload);

// additional routes for development
router.post('/thread', [verifyToken, thread.createThread]);
router.get('/threads', [verifyToken, thread.getThreads]);
router.get('/allthreads', [verifyToken, thread.getAllThreads]);
router.post('/message', [verifyToken, message.createMessage]);
router.get('/messages/:threadId', [verifyToken, message.getMessagesByThread]);

export default router;
