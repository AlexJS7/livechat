import _ from 'lodash';
import { Thread, User } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function addRep(req, res, next) {
  Thread.findOne({ _id: req.body.threadId })
    .then((thread) => {
      if (!thread) {
        log.warn('No such thread: ', thread._id);
        throw new Error('Thread not found');
      }
      return thread;
    })
    .then((thread) => {
      const newReps = req.body.repIds.map(rep => User.findOne({ _id: rep }));
      return Promise.all(newReps)
        .then((reps) => {
          reps.forEach((rep) => {
            rep.update({ $addToSet: { threads: thread._id } })
              .then(() => log.info(`User ${rep._id} thread list successfully updated`));
          });
          return reps;
        })
        .then((reps) => {
          const ids = reps.map(rep => rep._id);
          const newRepIds = _.uniq(thread.repIds.concat(ids));
          return thread.update({ repIds: newRepIds }, { new: true })
            .then(() => res.json({
              success: true,
              data: {
                thread,
                reps: reps.map((rep) => {
                  const { _id, firstName, lastName } = rep;
                  return {
                    _id,
                    name: `${firstName} ${lastName}`,
                  };
                }),
              },
            }));
        });
    })
    .catch(next);
}

export default addRep;
