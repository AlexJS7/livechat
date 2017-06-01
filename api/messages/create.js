import { Message, Thread } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('message.controller');

function create(req, res, next) {
  const userId = req.decoded._doc._id;
  const io = req.app.get('socketio');
  Thread.findOne({ _id: req.body.threadId })
    .then((thread) => {
      if (!thread) {
        log.warn('No such thread');
        throw new Error('Thread not found');
      }
      return thread;
    })
    .then((thread) => {
      const newMsg = new Message(req.body);
      newMsg.save((err, msg) => {
        thread.update({ $push: { messages: msg._id }, repIds: userId })
          .then(() => {
            const obj = {
              thread: thread._id,
              msg,
              userId,
            };
            io.emit('new message', obj);
          });
        res.json({
          success: true,
          message: msg,
          threadId: thread._id,
        });
      });
    })
    .catch(next);
}

export default create;
