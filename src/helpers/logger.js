/* eslint-disable no-console */
const isDev = process.env.NODE_ENV === 'development';

const shouldLog = () => isDev;

const logger = {
  debug: (...args) => {
    if (shouldLog()) {
      console.debug(...args);
    }
  },
  log: (...args) => {
    if (shouldLog()) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (shouldLog()) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (shouldLog()) {
      console.warn(...args);
    }
  },
  error: (...args) => console.error(...args),
};

export default logger;
