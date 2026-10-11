/* eslint-disable no-console */

// Usage: logger.<level>(NAMESPACE, ...args) — output is prefixed with `[ NAMESPACE ]`.
// error / warn are always printed. log / info / debug / trace are printed only in development
// (Vite `import.meta.env.DEV`, or NODE_ENV !== 'production' for plain Node) or when LOG_VERBOSE=true.

const isDev = () => {
  const viteDev = import.meta.env?.DEV;
  if (viteDev !== undefined) return !!viteDev;
  return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
};

const isVerbose = isDev() || (typeof process !== 'undefined' && process.env?.LOG_VERBOSE === 'true');

// Noisy namespaces muted for verbose levels (errors and warnings still pass).
const MUTED_NAMESPACES = ['Api_Requests', 'mdb_sagas'];

const verbose = method => (nameSpace, ...args) => {
  if (isVerbose && !MUTED_NAMESPACES.includes(nameSpace)) {
    console[method](`[ ${nameSpace} ]`, ...args);
  }
};

const always = method => (nameSpace, ...args) => console[method](`[ ${nameSpace} ]`, ...args);

const logger = {
  error: always('error'),
  warn : always('warn'),
  log  : verbose('log'),
  info : verbose('info'),
  debug: verbose('debug'),
  trace: verbose('trace'),
};

export default logger;
