/* eslint-disable consistent-return */

export function logErrors(err, req, res, next) {
  console.error(err.stack);
  console.info(`error handling ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Internal Server Error');
}
