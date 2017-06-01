import StatusError from 'status-errors';
import { Thread, User, Message, Company } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function all(req, res, next) {
  const userId = req.decoded._doc._id;
  const companyId = req.decoded._doc.companyId;
  Company.findOne({ _id: companyId })
    .then((company) => {
      if (!company) {
        log.error('Company not found');
        return next(new StatusError(400, 'Wrong company data'));
      }
      return company;
    })
    .then(company => User.findOne({ _id: userId })
    .then((user) => {
      if (!user || user.role !== 'admin') {
        log.error('User not found');
        return next(new StatusError(400, 'Wrong user data'));
      }
      return Promise.resolve();
    })
    .then(() => Thread.find({
      live: true,
      botId: {
        $in: company.bots,
      },
    })))
    .then((threads) => {
      const promiseList = threads.map(t =>
        new Promise((resolve, reject) => {
          Message.find({ _id: { $in: t.messages } })
            .sort({ createdAt: -1 })
            .then((messages) => {
              resolve(Object.assign({}, t._doc, {
                unseenMessages: messages.filter(m => m.seen === false).length,
                lastMessage: messages[0],
              }));
            })
            .catch((err) => {
              reject(err);
              next(err);
            });
        }),
      );
      return Promise.all(promiseList);
    })
    .then((modifiedThreads) => {
      res.json({
        success: true,
        threads: modifiedThreads,
      });
    })
    .catch(next);
}

export default all;
