import StatusError from 'status-errors';
import { Company, Thread } from 'chat-models';
import _ from 'lodash';
import uuid from 'uuid';
import getLogger from '../../services/log.service';

const log = getLogger('chat.controller');

function inbound(req, res, next) {
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
      Company.findOne({ bots: req.body.botId })
        .then((company) => {
          const companyObj = company.toObject();
          const repIds = _.intersection(thread.repIds, companyObj.users);
          const nsp = io.of(companyObj._id);
          if (repIds) {
            repIds.forEach(id => nsp.to(id).emit('new message', {
              _id: uuid.v4(),
              content: req.body.content,
              threadId: req.body.threadId,
            }));
          } else {
            thread.update({ live: true }, { new: true });
            nsp.to(companyObj._id).emit('new message', {
              _id: uuid.v4(),
              content: req.body.content,
              threadId: req.body.threadId,
            });
          }
        });
    })
    .catch(next);
}

export default inbound;
