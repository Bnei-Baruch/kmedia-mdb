import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createId } from '@paralleldrive/cuid2';
import { getUILangFromPath } from '../src/helpers/url.js';
import logger from '../src/logger/logger.js';
const NAMESPACE = 'app-server';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const serveStatic = express.static(PUBLIC_DIR);

// Single static handler for everything in /public (favicon, manifest, robots,
// locales, assets, themes...). Strips an optional /:lang prefix so language-
// prefixed asset URLs (e.g. /en/manifest.json) resolve to the same file.
export function staticFiles(req, res, next) {
  const original = req.url;
  req.url = original.replace(/^\/[a-z]{2}(?=\/)/, '');
  serveStatic(req, res, err => {
    req.url = original;
    next(err);
  });
}

// Asset-like requests that fell through the static handlers, and probes like
// /.well-known/*, are not navigable pages: they must skip the language redirect
// and SSR. Left unhandled, Express answers them with its own 404.
const STATIC_EXT_RE = /\.(?:json|js|mjs|css|map|ico|png|jpe?g|gif|svg|webp|avif|woff2?|ttf|eot|txt|xml|pdf|webmanifest)$/i;

export const isNonPage = reqPath => reqPath.includes('/.well-known/') || STATIC_EXT_RE.test(reqPath);

logger.info(NAMESPACE, 'Base URL:', BASE_URL);

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

const getDurationInMilliseconds = start => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

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
        duration: durationInMilliseconds,
      };
      console.log(JSON.stringify(doneEntry));
    }
  };
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

export function noLanguageRedirect(req, res, next) {
  if (isNonPage(req.path)) {
    return next();
  }

  const { redirect, language } = getUILangFromPath(req.originalUrl, req.headers, req.get('user-agent'));

  if (redirect) {
    const newUrl = `${BASE_URL}${language}${req.originalUrl}`;
    logger.info(NAMESPACE, 'redirect to language url', newUrl);
    return res.redirect(307, newUrl);
  }

  return next();
}
