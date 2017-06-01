import StatusError from 'status-errors';
import { Thread, User, Message, Company } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function get(req, res, next) {
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
      if (!user) {
        log.error('User not found');
        return next(new StatusError(400, 'Wrong user data'));
      }
      return user;
    })
    .then(user => Thread.find({
      $or: [{
        _id: {
          $in: user.threads,
        },
        live: true,
        botId: {
          $in: company.bots,
        },
      }, {
        repIds: {
          $size: 0,
        },
        botId: {
          $in: company.bots,
        },
        live: true,
      }],
    })))
    .then((threads) => {
      const promiseList = threads.map(thread => Promise.resolve()
        .then(() => Message.find({ _id: { $in: thread.messages } }).sort({ createdAt: -1 })
        .then(messages => Object.assign({}, thread._doc, {
          unseenMessages: messages.filter(m => m.seen === false).length,
          lastMessage: messages[0],
        }))));
      return Promise.all(promiseList);
    })
    .then((threads) => {
      // io.emit('threads', { msg: 'in thread controller' });
      res.json({
        success: true,
        threads,
      });
    })
    .catch(next);
}

export default get;
