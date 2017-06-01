import { Message, Thread } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('chat.controller');

function get(req, res, next) {
  const userId = req.decoded._doc._id;
  Thread.findOne({ _id: req.params.threadId })
    .then((thread) => {
      if (!thread) {
        log.warn('No such thread: ', thread._id);
        throw new Error('Thread not found');
      }
      return thread;
    })
    .then((thread) => {
      thread.update({ repIds: [userId], live: true })
        .then(() => {
          const promiseArr = thread.messages.map(msg =>
            Message.findOneAndUpdate({ _id: msg }, { seen: true }),
          );
          Promise.all(promiseArr)
            .then((messages) => {
              res.json({
                success: true,
                messages,
              });
            });
        })
        .catch(err => log.warn(`err: ${err.message}`));
    })
    .catch(next);
}

export default get;
