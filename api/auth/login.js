import jwt from 'jsonwebtoken';
import StatusError from 'status-errors';
import { User, Company } from 'chat-models';
import dotenv from 'dotenv';
import getLogger from '../../services/log.service';

dotenv.config();

const log = getLogger('auth.controller');
const secret = process.env.SECRET;

function login(req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        log.error('User not found');
        return next(new StatusError(400, 'Wrong user data'));
      }
      return user;
    })
    .then((user) => {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          const token = jwt.sign(user, secret, {
            expiresIn: 86400,
          });
          Company.findOne({ users: user._id })
            .then(company => (
              res.send({
                success: true,
                message: 'token successfully created',
                token,
                user: {
                  id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  role: user.role,
                  companyId: company._id,
                },
              })
            ));
        } else {
          log.warn('Password doesn\'t match');
          next(new StatusError(400, 'Wrong password'));
        }
      });
    })
    .catch(err => next(err));
}

export default login;
