import { createId } from '@paralleldrive/cuid2';

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
  console.info('>>> %s %s %s %s', new Date().toISOString(), req.method, req.url, req.path);
  next();
}

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

function createLogDuration(entry, opts, msg) {
	return function logDuration() {
    // Don't log both FINISHED & CLOSED, just one.
    // Finished will not be called in some cases (499 client disconnected for example).
    if (!opts.logged) {
      opts.logged = true;
      const durationInMilliseconds = getDurationInMilliseconds(opts.start);

      const doneEntry = {
        ...entry,
        msg,
        timestamp: new Date().toISOString(),
        status: this.statusCode,
        duration: durationInMilliseconds
      };
      console.log(JSON.stringify(doneEntry));
    }
	}
}

export function duration(req, res, next) {
		const id = createId();
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];

    const entry = {
      msg: 'STARTED',
      id,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      ip,
      user_agent: userAgent,
    };
    console.log(JSON.stringify(entry));

    const opts = {
      start: process.hrtime(),
      logged: false,
    };

    res.on('finish', createLogDuration(entry, opts, 'FINISHED'));
    res.on('close', createLogDuration(entry, opts, 'CLOSED'));

    next();
}
