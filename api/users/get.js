import StatusError from 'status-errors';
import { User, Company } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('thread.controller');

function get(req, res, next) {
  const companyId = req.decoded._doc.companyId;
  Company.findOne({ _id: companyId })
    .then((company) => {
      if (!company) {
        log.error('Company not found');
        return next(new StatusError(400, 'Wrong company data'));
      }
      return company;
    })
    .then(company => User.find({ companyId: company._id }))
    .then((users) => {
      if (!users) {
        log.warn('Cannot get users');
      }
      return users;
    })
    .then((users) => {
      const modifiedUsers = users.map(user => ({
        id: user._id,
        email: user.email,
        name: {
          first: user.firstName,
          last: user.lastName,
        },
      }),
      );
      res.json({
        success: true,
        users: modifiedUsers,
      });
    })
    .catch(next);
}

export default get;
