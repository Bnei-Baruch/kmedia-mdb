import { parse as cookieParse } from 'cookie';
import crawlers from 'crawler-user-agents';
import fs from 'fs';
import path from 'path';
import { KC_BOT_USER_NAME } from '../src/helpers/consts.js';
import { renderSSR, renderSSRStream } from './rendererUtils.jsx';
import logger from '../src/logger/logger.js';

const NAMESPACE = 'renderer';
const ADDITIONAL_BOTS = ['Google-InspectionTool', 'Storebot-Google', 'GoogleOther'];

const htmlDir = process.env.NODE_ENV === 'production' ? 'build' : '.';
const htmlDataAnon = fs.readFileSync(path.resolve(process.cwd(), htmlDir, 'index-anon.html'), 'utf8');

function isBot(req) {
  const ua = req.headers['user-agent'] || '';
  return (
    crawlers.some(entry => RegExp(entry.pattern).test(ua)) ||
    ADDITIONAL_BOTS.some(p => RegExp(p).test(ua))
  );
}

export async function render(req) {
  const url = req.originalUrl;
  logger.info(NAMESPACE, 'render request', url);
  if (isBot(req) || req.query.embed) {
    logger.info(NAMESPACE, 'bot/embed render', url);
    return { html: await renderSSR(req, { auth: { user: { name: KC_BOT_USER_NAME } } }), skipTransform: false };
  }

  const cookies = cookieParse(req.headers.cookie || '');
  const isKcCallback = req.query.code && req.query.session_state;
  if (cookies.authorised || req.query.authorised || isKcCallback) {
    logger.info(NAMESPACE, 'auth render', url);
    return { html: await renderSSR(req), skipTransform: false };
  }

  logger.info(NAMESPACE, 'anon render', url);
  return { html: htmlDataAnon, skipTransform: true };
}

export default async function serverRender(req, res, next) {
  const url = req.originalUrl;
  try {
    if (isBot(req) || req.query.embed) {
      logger.info(NAMESPACE, 'bot/embed render', url);
      const html = await renderSSR(req, { auth: { user: { name: KC_BOT_USER_NAME } } });
      return res.send(html);
    }

    const cookies = cookieParse(req.headers.cookie || '');
    const isKcCallback = req.query.code && req.query.session_state;
    if (cookies.authorised || req.query.authorised || isKcCallback) {
      logger.info(NAMESPACE, 'auth stream render', url);
      return await renderSSRStream(req, res);
    }

    logger.info(NAMESPACE, 'anon render', url);
    res.send(htmlDataAnon);
  } catch (err) {
    if (res.headersSent) {
      logger.error(NAMESPACE, 'stream error after headers sent', err);
      res.end();
    } else {
      next(err);
    }
  }
}
