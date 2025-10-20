import crawlers from 'crawler-user-agents';

const ADDITIONAL_BOTS = ['Google-InspectionTool', 'Storebot-Google', 'GoogleOther'];

/**
 * Detects if the request is from a bot/crawler
 * @param {Object} req - Express request object
 * @returns {boolean} - true if request is from a bot
 */
export function isBot(req) {
  const userAgent = req.headers['user-agent'] || '';
  
  return crawlers.some(entry => RegExp(entry.pattern).test(userAgent))
    || ADDITIONAL_BOTS.some(pattern => RegExp(pattern).test(userAgent));
}

/**
 * Checks if the request should be treated as a bot request
 * This includes actual bots and embedded content
 * @param {Object} req - Express request object
 * @returns {boolean}
 */
export function shouldTreatAsBot(req) {
  return isBot(req) || !!req.query.embed;
}

