export function logErrors(err, req, res, next) {
  if (err && err.stack) {
    console.log(err.stack);
  } else {
    console.log(err);
  }
  console.info(`error handling ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send('Internal Server Error');
  return null;
}

export function logAll(req, res, next) {
  console.info('>>> %s %s %s', req.method, req.url, req.path);
  next();
}
