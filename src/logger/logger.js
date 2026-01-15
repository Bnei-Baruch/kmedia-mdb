

const isServer = typeof window === 'undefined';

const logger = {
  log: (...args) => {
    if (isServer) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isServer) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isServer) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (isServer) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (isServer) {
      console.debug(...args);
    }
  },
  trace: (...args) => {
    if (isServer) {
      console.trace(...args);
    }
  },
};

export default logger;