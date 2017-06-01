import StatusError from 'status-errors';
import { User } from 'chat-models';
import getLogger from '../../services/log.service';

const log = getLogger('auth.controller');

function signup(req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        log.warn('User already exists');
        throw new StatusError(409, 'User already exists');
      } else {
        const newUser = new User(req.body);
        newUser.save();

        res.send({
          success: true,
          message: 'user successfully registered',
        });
      }
    })
    .catch(next);
}

export default signup;
