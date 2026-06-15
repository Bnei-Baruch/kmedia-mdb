

const isServer = true// typeof window === 'undefined';

const filterByNameSpace = ns => (
  ns !== 'Api_Requests' &&
  ns !== 'mdb_sagas'
);

const logger = {
  log: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.log(`[ ${nameSpace} ]`, ...args);
    }
  },
  error: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.error(`[ ${nameSpace} ]`, ...args);
    }
  },
  warn: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.warn(`[ ${nameSpace} ]`, ...args);
    }
  },
  info: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.info(`[ ${nameSpace} ]`, ...args);
    }
  },
  debug: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.debug(`[ ${nameSpace} ]`, ...args);
    }
  },
  trace: (nameSpace, ...args) => {
    if (isServer && filterByNameSpace(nameSpace)) {
      console.trace(`[ ${nameSpace} ]`, ...args);
    }
  },
};

export default logger;
