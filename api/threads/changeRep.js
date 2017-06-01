import { Thread, User } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function changeRep(req, res, next) {
  Thread.findOne({ _id: req.body.threadId })
    .then((thread) => {
      if (!thread) {
        log.warn('No such thread: ', thread._id);
        throw new Error('Thread not found');
      }
      return thread;
    })
    .then(thread => User.find({ _id: { $in: thread.repIds } }).exec()
      .then((users) => {
        const userPromises = users.map(user => user.update({
          $pull: {
            threads: thread._id,
          },
        }).exec());
        return Promise.all(userPromises);
      })
      .then(() => thread))
    .then(thread => thread.update({ repIds: [req.body.repIds] })
      .then(() => log.info(`Thread ${thread._id} successfully updated repIds`))
      .then(() => thread))
    .then((thread) => {
      User.findOneAndUpdate(
        { _id: req.body.repIds },
        { $addToSet: { threads: thread._id } },
        { new: true })
        .then(user => log.info(`Thread ${thread._id} successfully added to ${user.email}`));
      return thread;
    })
    .then((thread) => {
      log.info(`Thread ${thread._id} successfully reassigned to rep ${req.body.repIds}`);
      res.json({
        success: true,
        thread,
      });
    })
    .catch(next);
}

export default changeRep;
