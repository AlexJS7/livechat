import jwt from 'jsonwebtoken';
import StatusError from 'status-errors';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  const errorStatusCode = 401;

  if (token) {
    jwt.verify(token, secret, (er, decoded) => {
      if (er) {
        next(new StatusError(errorStatusCode, 'Failed to authenticate token'));
      }
      req.decoded = decoded; // eslint-disable-line no-param-reassign
      next();
    });
  } else {
    next(new StatusError(errorStatusCode, 'Token is required'));
  }
};

export default verifyToken;
