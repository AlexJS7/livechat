import bcrypt from 'bcrypt';
import StatusError from 'status-errors';
import { User } from 'chat-models';

function password(req, res, next) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        next(new StatusError(500, 'No user found'));
      } else {
        user.comparePassword(req.body.oldPassword, (err, isMatch) => {
          if (isMatch && !err) {
            const saltRounds = 10;
            const newPassword =
              bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(saltRounds));
            const update = { $set: { password: newPassword } };
            const options = { safe: true, upsert: true };
            user.update(update, options)
              .then(() => {
                res.send({
                  success: true,
                  message: 'Password successfully updated',
                });
              });
          } else {
            res.send({
              success: false,
              message: 'Password doesn\'t match',
            });
          }
        });
      }
    })
    .catch(next);
}

export default password;
