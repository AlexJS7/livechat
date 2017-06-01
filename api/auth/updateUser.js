import StatusError from 'status-errors';
import { User } from 'chat-models';

function updateUser(req, res, next) {
  if (req.body._id || req.body.password) {
    next(new StatusError(400, 'pass valid user update data'));
  } else {
    const filter = { _id: req.decoded._doc._id };
    const update = { $set: req.body };
    const options = { new: true };
    User.findOneAndUpdate(filter, update, options)
      .then((user) => {
        if (!user) next(new StatusError(500, 'Cannot find user'));
        res.send({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        });
      })
      .catch(next);
  }
}

export default updateUser;
