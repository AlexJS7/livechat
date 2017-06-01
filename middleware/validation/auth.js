import joi from 'joi';
import StatusError from 'status-errors';

export default {

  auth: (req, res, next) => {
    const minPasswordLength = 3;
    const maxPasswordLength = 20;

    const validationObject = {
      email: joi.string().email()
        .required(),
      password: joi.string()
        .min(minPasswordLength)
        .max(maxPasswordLength)
        .required(),
    };

    joi.validate({
      email: req.body.email,
      password: req.body.password,
    }, validationObject, (er) => {
      if (er) {
        next(new StatusError(400, 'Wrong user data'));
      }
      next();
    });
  },
};
