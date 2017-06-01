import StatusError from 'status-errors';

/**
 *
 * @param role - string that represents user role
 * @returns next or error
 */
const requireRole = (role) => {
  const errStatusCode = 403;

  return (req, res, next) => {
    if (req.decoded._doc.role === role) {
      next();
    } else {
      next(new StatusError(errStatusCode, 'User role has not permissions for this route'));
    }
  };
};

export default requireRole;
