import StatusError from 'status-errors';
import { Message, Thread } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('chat.controller');

function outbound(req, res, next) {
  const io = req.app.get('socketio');
  Thread.findOne({ _id: req.body.threadId })
    .then((thread) => {
      if (!thread) {
        log.error('Thread not found');
        return next(new StatusError(400, 'Thread not found'));
      }
      return thread;
    })
    .then((thread) => {
      const newMessage = new Message({ text: req.body.text });
      newMessage.save();
      thread.update({ $push: { messages: newMessage } });
      io.to(req.body.source, { message: req.body.text });
    })
    .catch(next);
}

export default outbound;
