/* eslint-disable quotes -- CSP tokens such as "'self'" must stay double-quoted */
import helmet from 'helmet';

// Security headers (CSP, frameguard, etc.) ported from app-prod.js.
// Kept in a dedicated module so the allow-lists stay easy to review and update.
export const securityHeaders = helmet({
  frameguard: false, // we want to allow embed in iframes
  dnsPrefetchControl: false, // we use dns prefetch in index.html to speed things up.
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      'default-src': [
        "'self'",
        '*.kbb1.com',
        '*.kli.one',
        'kabbalahmedia.info',
        '*.kabbalahmedia.info',
        'archive', // suitcase
        '*.archive', // suitcase
        '*.usersnap.com',
        '*.twimg.com',
        '*.youtube.com',
        '*.youtube-nocookie.com',
        '*.google-analytics.com',
        '*.analytics.google.com',
        'analytics.google.com',
        '*.googletagmanager.com',
        '*.g.doubleclick.net',
        '*.kab.info',
        '*.kab.sh',
        '*.jwplayer.com',
      ],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        '*.google-analytics.com',
        '*.googletagmanager.com',
        'kabbalahmedia.info',
        'archive', // suitcase
        '*.usersnap.com',
        'cdnjs.cloudflare.com', // for pdf worker
        'cdn.jwplayer.com',
        '*.jwpcdn.com',
        '*.hlsjs.js',
        'blob:',
      ],
      'style-src': ["'self'", "'unsafe-inline'", '*.googleapis.com'],
      'font-src': [
        "'self'",
        'data:',
        'fonts.gstatic.com',
        'cdnjs.cloudflare.com', // for sketches ionic icons. remove when possible
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        '*.kbb1.com',
        'kabbalahmedia.info',
        '*.kabbalahmedia.info',
        'archive', // suitcase
        '*.archive', // suitcase
        'laitman.ru',
        'www.laitman.ru',
        'laitman.com',
        'laitman.es',
        'laitman.co.il',
        '*.google-analytics.com',
        '*.analytics.google.com',
        '*.googletagmanager.com',
        '*.g.doubleclick.net',
        '*.google.co.il',
        '*.google.com',
        '*.usersnap.com',
        '*.twimg.com',
        '*.jwpltx.com',
      ],
      'media-src': ["'self'", 'data:', 'blob:', '*.kabbalahmedia.info', '*.kab.info', '*.kab.sh'],
      'worker-src': ['blob:', '*.kabbalahmedia.info'],
      'frame-ancestors': ['*'],
      'object-src': ['*.youtube.com'],
    },
    browserSniff: false, // we're not targeting really old browsers
  },
});
