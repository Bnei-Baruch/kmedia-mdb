

const isServer = typeof window === 'undefined';

const logger = {
  log: (nameSpace, ...args) => {
    if (isServer) {
      console.log(`[ ${nameSpace} ]`, ...args);
    }
  },
  error: (nameSpace, ...args) => {
    if (isServer) {
      console.error(`[ ${nameSpace} ]`, ...args);
    }
  },
  warn: (nameSpace, ...args) => {
    if (isServer) {
      console.warn(`[ ${nameSpace} ]`, ...args);
    }
  },
  info: (nameSpace, ...args) => {
    if (isServer) {
      console.info(`[ ${nameSpace} ]`, ...args);
    }
  },
  debug: (nameSpace, ...args) => {
    if (isServer) {
      console.debug(`[ ${nameSpace} ]`, ...args);
    }
  },
  trace: (nameSpace, ...args) => {
    if (isServer) {
      console.trace(`[ ${nameSpace} ]`, ...args);
    }
  },
};

export default logger;
