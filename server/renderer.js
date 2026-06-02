import { parse as cookieParse } from 'cookie';
import crawlers from 'crawler-user-agents';
import fs from 'fs';
import path from 'path';
import { KC_BOT_USER_NAME } from '../src/helpers/consts';
import { renderSSR } from './rendererUtils';
import logger from '../src/logger/logger';

const NAMESPACE = 'renderer';
const ADDITIONAL_BOTS = ['Google-InspectionTool', 'Storebot-Google', 'GoogleOther'];

const htmlDataAnon = fs.readFileSync(path.resolve(process.cwd(), 'index-anon.html'), 'utf8');

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
  if (cookies.authorised || req.query.authorised) {
    logger.info(NAMESPACE, 'auth render', url);
    return { html: await renderSSR(req), skipTransform: false };
  }

  logger.info(NAMESPACE, 'anon render', url);
  return { html: htmlDataAnon, skipTransform: true };
}
