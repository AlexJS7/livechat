import StatusError from 'status-errors';
import { Thread, User } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function create(req, res, next) {
  const userId = req.decoded._doc._id;
  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        log.error('User not found');
        return next(new StatusError(400, 'Wrong user data'));
      }
      return user;
    })
    .then((user) => {
      const newThread = new Thread(req.body);
      newThread.save((err, data) => {
        user.update({ $push: { threads: data._id } })
          .then(() => {
            log.info('new thread created');
            res.json({
              success: true,
              message: 'thread created successfully',
            });
          });
      });
    })
    .catch(next);
}

export default create;
