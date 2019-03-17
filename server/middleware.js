/* eslint-disable consistent-return,no-console */

export function logErrors(err, req, res, next) {
  try {
    throw new Error(err);
  } catch (e) {
    console.error(e.stack || e);
  }
  console.info(`error handling ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send('Internal Server Error');
}
