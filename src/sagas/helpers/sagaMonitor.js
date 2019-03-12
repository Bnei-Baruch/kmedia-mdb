/*
eslint-disable
semi,
no-else-return,
no-console,
no-use-before-define,
brace-style,
keyword-spacing,
no-nested-ternary,
no-multi-spaces,
id-length,
object-curly-spacing,
one-var,
one-var-declaration-per-line,
array-bracket-spacing,
*/

import { asEffect, is } from 'redux-saga/utils';

const util = require('util');

export const EFFECT_STATUS_PENDING   = 'PENDING';
export const EFFECT_STATUS_RESOLVED  = 'RESOLVED';
export const EFFECT_STATUS_REJECTED  = 'REJECTED';
export const EFFECT_STATUS_CANCELLED = 'CANCELLED';

const DEFAULT_STYLE     = 'color: black';
const LABEL_STYLE       = 'font-weight: bold';
const EFFECT_TYPE_STYLE = 'color: blue';
const ERROR_STYLE       = 'color: red';
const CANCEL_STYLE      = 'color: #ccc';

const IS_BROWSER = (typeof window !== 'undefined' && window.document);

export default function createSagaMonitor(
  {
    debug = false,
    exportToWindow = true,
  } = {}) {
  const VERBOSE = debug;

  const time = () => {
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    } else {
      return Date.now();
    }
  };

  const effectsById = {};

  function effectTriggered(desc) {
    if (VERBOSE) {
      console.log('Saga monitor: effectTriggered:', desc);
    }

    effectsById[desc.effectId] = Object.assign({},
      desc,
      {
        status: EFFECT_STATUS_PENDING,
        start: time()
      }
    );
  }

  function effectResolved(effectId, result) {
    if (VERBOSE) {
      console.log('Saga monitor: effectResolved:', effectId, result);
    }

    resolveEffect(effectId, result);
  }

  function effectRejected(effectId, error) {
    if (VERBOSE) {
      console.log('Saga monitor: effectRejected:', effectId, error);
    }

    rejectEffect(effectId, error);
  }

  function effectCancelled(effectId) {
    if (VERBOSE) {
      console.log('Saga monitor: effectCancelled:', effectId);
    }

    cancelEffect(effectId);
  }

  function computeEffectDur(effect) {
    const now = time();
    Object.assign(effect, {
      end: now,
      duration: now - effect.start
    });
  }

  function resolveEffect(effectId, result) {
    const effect = effectsById[effectId];

    if (is.task(result)) {
      result.done.then(
        (taskResult) => {
          if (result.isCancelled()) {
            cancelEffect(effectId);
          } else {
            resolveEffect(effectId, taskResult);
          }
        },
        taskError => rejectEffect(effectId, taskError)
      );
    } else {
      computeEffectDur(effect);
      effect.status = EFFECT_STATUS_RESOLVED;
      effect.result = result;
      if (effect && asEffect.race(effect.effect)) {
        setRaceWinner(effectId, result);
      }
    }
  }

  function rejectEffect(effectId, error) {
    const effect = effectsById[effectId];
    computeEffectDur(effect);
    effect.status = EFFECT_STATUS_REJECTED;
    effect.error  = error;
    if (effect && asEffect.race(effect.effect)) {
      setRaceWinner(effectId, error);
    }
  }

  function cancelEffect(effectId) {
    const effect = effectsById[effectId];
    computeEffectDur(effect);
    effect.status = EFFECT_STATUS_CANCELLED;
  }

  function setRaceWinner(raceEffectId, result) {
    const winnerLabel = Object.keys(result)[0];
    const children    = getChildEffects(raceEffectId);
    for (let i = 0; i < children.length; i++) {
      const childEffect = effectsById[children[i]];
      if (childEffect.label === winnerLabel) {
        childEffect.winner = true;
      }
    }
  }

  function getChildEffects(parentEffectId) {
    return Object.keys(effectsById)
      .filter(effectId => effectsById[effectId].parentEffectId === parentEffectId)
      .map(effectId => +effectId);
  }

  // Poor man's `console.group` and `console.groupEnd` for Node.
  // Can be overridden by the `console-group` polyfill.
  // The poor man's groups look nice, too, so whether to use
  // the polyfilled methods or the hand-made ones can be made a preference.
  let groupPrefix   = '';
  const GROUP_SHIFT = '   ';
  const GROUP_ARROW = '▼';

  function consoleGroup(...args) {
    if (console.group) {
      console.group(...args);
    } else {
      console.log('');
      console.log(groupPrefix + GROUP_ARROW, ...args);
      groupPrefix += GROUP_SHIFT;
    }
  }

  function consoleGroupEnd() {
    if (console.groupEnd) {
      console.groupEnd();
    } else {
      groupPrefix = groupPrefix.substr(0, groupPrefix.length - GROUP_SHIFT.length);
    }
  }

  function logEffectTree(effectId) {
    const effect = effectsById[effectId];
    if (effectId === undefined) {
      console.log(groupPrefix, 'Saga monitor: No effect data for', effectId);
      return;
    }
    const childEffects = getChildEffects(effectId);

    if (!childEffects.length) {
      logSimpleEffect(effect);
    } else {
      if (effect) {
        const { formatter } = getEffectLog(effect);
        consoleGroup(...formatter.getLog());
      } else {
        consoleGroup('root');
      }

      childEffects.forEach(logEffectTree);

      consoleGroupEnd();
    }
  }

  function logSimpleEffect(effect) {
    const { method, formatter } = getEffectLog(effect);
    console[method](...formatter.getLog());
  }

  /* eslint-disable no-cond-assign */
  function getEffectLog(effect) {
    let data, log;

    if (data = asEffect.take(effect.effect)) {
      log = getLogPrefix('take', effect);
      log.formatter.addValue(data);
      logResult(effect, log.formatter);
    } else if (data = asEffect.put(effect.effect)) {
      log = getLogPrefix('put', effect);
      logResult(Object.assign({}, effect, { result: data }), log.formatter);
    } else if (data = asEffect.call(effect.effect)) {
      log = getLogPrefix('call', effect);
      log.formatter.addCall(data.fn.name, data.args);
      logResult(effect, log.formatter);
    } else if (data = asEffect.cps(effect.effect)) {
      log = getLogPrefix('cps', effect);
      log.formatter.addCall(data.fn.name, data.args);
      logResult(effect, log.formatter);
    } else if (data = asEffect.fork(effect.effect)) {
      log = getLogPrefix('', effect);
      log.formatter.addCall(data.fn.name, data.args);
      logResult(effect, log.formatter);
    } else if (data = asEffect.join(effect.effect)) {
      log = getLogPrefix('join', effect);
      logResult(effect, log.formatter);
    } else if (data = asEffect.race(effect.effect)) {
      log = getLogPrefix('race', effect);
      logResult(effect, log.formatter, true);
    } else if (data = asEffect.cancel(effect.effect)) {
      log = getLogPrefix('cancel', effect);
      log.formatter.appendData(data.name);
    } else if (data = asEffect.select(effect.effect)) {
      log = getLogPrefix('select', effect);
      log.formatter.addCall(data.selector.name, data.args);
      logResult(effect, log.formatter);
    } else if (is.array(effect.effect)) {
      log = getLogPrefix('parallel', effect);
      logResult(effect, log.formatter, true);
    } else if (is.iterator(effect.effect)) {
      log = getLogPrefix('', effect);
      log.formatter.addValue(effect.effect.name);
      logResult(effect, log.formatter, true);
    } else {
      log = getLogPrefix('unkown', effect);
      logResult(effect, log.formatter);
    }

    return log;
  }

  function getLogPrefix(type, effect) {
    const isCancel = effect.status === EFFECT_STATUS_CANCELLED;
    const isError  = effect.status === EFFECT_STATUS_REJECTED;

    const method    = isError ? 'error' : 'log';
    const winnerInd = effect && effect.winner
      ? (isError ? '✘' : '✓')
      : '';

    const style = s => (
      isCancel
        ? CANCEL_STYLE
        : (
          isError
            ? ERROR_STYLE
            : s
        )
    );

    const formatter = logFormatter();

    if (winnerInd) {
      formatter.add(`%c ${winnerInd}`, style(LABEL_STYLE));
    }

    if (effect && effect.label) {
      formatter.add(`%c ${effect.label}: `, style(LABEL_STYLE));
    }

    if (type) {
      formatter.add(`%c ${type} `, style(EFFECT_TYPE_STYLE));
    }

    formatter.add('%c', style(DEFAULT_STYLE));

    return {
      method,
      formatter
    };
  }

  function argToString(arg) {
    return (
      typeof arg === 'function'
        ? `${arg.name}`
        : (
          typeof arg === 'string'
            ? `'${arg}'`
            : arg
        )
    );
  }

  function logResult({ status, result, error, duration }, formatter, ignoreResult) {
    if (status === EFFECT_STATUS_RESOLVED && !ignoreResult) {
      if (is.array(result)) {
        formatter.addValue(' → ');
        formatter.addValue(result);
      } else {
        formatter.appendData('→', result);
      }
    } else if (status === EFFECT_STATUS_REJECTED) {
      formatter.appendData('→ ⚠', error);
    } else if (status === EFFECT_STATUS_PENDING) {
      formatter.appendData('⌛');
    } else if (status === EFFECT_STATUS_CANCELLED) {
      formatter.appendData('→ Cancelled!');
    }

    if (status !== EFFECT_STATUS_PENDING) {
      formatter.appendData(`(${duration.toFixed(2)}ms)`);
    }
  }

  function isPrimitive(val) {
    return typeof val === 'string'
      || typeof val === 'number'
      || typeof val === 'boolean'
      || typeof val === 'symbol'
      || val === null
      || val === undefined;
  }

  function logFormatter() {
    const logs = [];
    let suffix = [];

    function add(msg, ...args) {
      // Remove the `%c` CSS styling that is not supported by the Node console.
      if (!IS_BROWSER && typeof msg === 'string') {
        const prevMsg = msg;
        const newMsg  = msg.replace(/^%c\s*/, '');
        if (newMsg !== prevMsg) {
          // Remove the first argument which is the CSS style string.
          args.shift();
        }
      }
      logs.push({ msg, args });
    }

    function appendData(...data) {
      suffix = suffix.concat(data);
    }

    function addValue(value) {
      if (isPrimitive(value)) {
        add(value);
      } else if (IS_BROWSER) {
        // The browser console supports `%O`, the Node console does not.
        add('%O', value);
      } else {
        add('%s', util.inspect(value));
      }
    }

    function addCall(name, args) {
      if (!args.length) {
        add(`${name}()`);
      } else {
        add(name);
        add('(');
        args.forEach((arg, i) => {
          addValue(argToString(arg));
          addValue(i === args.length - 1 ? ')' : ', ');
        });
      }
    }

    function getLog() {
      const msgs   = [];
      let msgsArgs = [];
      for (let i = 0; i < logs.length; i++) {
        msgs.push(logs[i].msg);
        msgsArgs = msgsArgs.concat(logs[i].args);
      }
      return [msgs.join('')].concat(msgsArgs).concat(suffix);
    }

    return {
      add, addValue, addCall, appendData, getLog
    };
  }

  /**
   * The snapshot-logging function for arbitrary use by external code.
   */
  const logSaga = () => {
    console.log('');
    console.log('Saga monitor:', Date.now(), (new Date()).toISOString());
    logEffectTree(0);
    console.log('');
  };

  /**
   * Returns all the effects hashed by identifier.
   *
   * @return {Object<string,SagaMonitorEffectDescriptor>} The effects hashed by identifier.
   */
  const getEffectsById = () => effectsById;

  /**
   * Returns effects that currently block the saga promise from resolving.
   *
   * @return {Array<SagaMonitorEffectDescriptor>} The effects array.
   */
  const getBlockingEffectsArray = () => {
    // Skip FORK and TAKE because they are auto-interrupted by the END action.
    const blockingEffects = Object.keys(effectsById)
      .filter(effectId => (
        effectsById[effectId].status === EFFECT_STATUS_PENDING
        && !asEffect.fork(effectsById[effectId].effect) && !asEffect.take(effectsById[effectId].effect)
      ))
      .map(effectId => effectsById[effectId]);

    return blockingEffects;
  };

  // The `sagaMonitor` to pass to the middleware.
  const sagaMonitor = {
    // Middleware interface.
    effectTriggered,
    effectResolved,
    effectRejected,
    effectCancelled,

    // Utility functions.
    getEffectsById,
    getBlockingEffectsArray,
    logSaga,
  };

  // Export the snapshot-logging function to run from the browser console or extensions.
  if (IS_BROWSER && exportToWindow) {
    window.$$LogSagas = logSaga;
  }

  return sagaMonitor;
}
