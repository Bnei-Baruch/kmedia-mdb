'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logSaga = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('redux-saga/utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-disable */

var PENDING = 'PENDING';
var RESOLVED = 'RESOLVED';
var REJECTED = 'REJECTED';
var CANCELLED = 'CANCELLED';

var DEFAULT_STYLE = 'color: black';
var LABEL_STYLE = 'font-weight: bold';
var EFFECT_TYPE_STYLE = 'color: blue';
var ERROR_STYLE = 'color: red';
var CANCEL_STYLE = 'color: #ccc';

var IS_SERVER = typeof window === 'undefined';
var IS_BROWSER = !IS_SERVER && window.document;
var globalScope = IS_SERVER ? global : typeof window.document === 'undefined' && navigator.product === 'ReactNative' ? global : IS_BROWSER ? window : null;

// `VERBOSE` can be made a setting configured from the outside.
var VERBOSE = false;

function time() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  } else {
    return Date.now();
  }
}

var effectsById = {};
var rootEffects = [];

function effectTriggered(desc) {
  if (VERBOSE) {
    console.log('Saga monitor: effectTriggered:', desc);
  }
  effectsById[desc.effectId] = Object.assign({}, desc, {
    status: PENDING,
    start: time()
  });
  if (desc.root) {
    rootEffects.push(desc.effectId);
  }
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
  var now = time();
  Object.assign(effect, {
    end: now,
    duration: now - effect.start
  });
}

function resolveEffect(effectId, result) {
  var effect = effectsById[effectId];

  if (_utils.is.task(result)) {
    result.done.then(function (taskResult) {
      if (result.isCancelled()) {
        cancelEffect(effectId);
      } else {
        resolveEffect(effectId, taskResult);
      }
    }, function (taskError) {
      return rejectEffect(effectId, taskError);
    });
  } else {
    computeEffectDur(effect);
    effect.status = RESOLVED;
    effect.result = result;
    if (effect && _utils.asEffect.race(effect.effect)) {
      setRaceWinner(effectId, result);
    }
  }
}

function rejectEffect(effectId, error) {
  var effect = effectsById[effectId];
  computeEffectDur(effect);
  effect.status = REJECTED;
  effect.error = error;
  if (effect && _utils.asEffect.race(effect.effect)) {
    setRaceWinner(effectId, error);
  }
}

function cancelEffect(effectId) {
  var effect = effectsById[effectId];
  computeEffectDur(effect);
  effect.status = CANCELLED;
}

function setRaceWinner(raceEffectId, result) {
  var winnerLabel = Object.keys(result)[0];
  var children = getChildEffects(raceEffectId);
  for (var i = 0; i < children.length; i++) {
    var childEffect = effectsById[children[i]];
    if (childEffect.label === winnerLabel) {
      childEffect.winner = true;
    }
  }
}

function getChildEffects(parentEffectId) {
  return Object.keys(effectsById).filter(function (effectId) {
    return effectsById[effectId].parentEffectId === parentEffectId;
  }).map(function (effectId) {
    return +effectId;
  });
}

// Poor man's `console.group` and `console.groupEnd` for Node.
// Can be overridden by the `console-group` polyfill.
// The poor man's groups look nice, too, so whether to use
// the polyfilled methods or the hand-made ones can be made a preference.
var groupPrefix = '';
var GROUP_SHIFT = '   ';
var GROUP_ARROW = '▼';

function consoleGroup() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (console.group) {
    var _console;

    (_console = console).group.apply(_console, args);
  } else {
    var _console2;

    console.log('');
    (_console2 = console).log.apply(_console2, [groupPrefix + GROUP_ARROW].concat(args));
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

function logEffects(topEffects) {
  topEffects.forEach(logEffectTree);
}

function logEffectTree(effectId) {
  var effect = effectsById[effectId];
  var childEffects = getChildEffects(effectId);

  if (!childEffects.length) {
    logSimpleEffect(effect);
  } else {
    var _getEffectLog = getEffectLog(effect),
        formatter = _getEffectLog.formatter;

    consoleGroup.apply(undefined, _toConsumableArray(formatter.getLog()));
    childEffects.forEach(logEffectTree);
    consoleGroupEnd();
  }
}

function logSimpleEffect(effect) {
  var _console3;

  var _getEffectLog2 = getEffectLog(effect),
      method = _getEffectLog2.method,
      formatter = _getEffectLog2.formatter;

  (_console3 = console)[method].apply(_console3, _toConsumableArray(formatter.getLog()));
}

/*eslint-disable no-cond-assign*/
function getEffectLog(effect) {
  var data = void 0,
      log = void 0;

  if (effect.root) {
    data = effect.effect;
    log = getLogPrefix('run', effect);
    log.formatter.addCall(data.saga.name, data.args);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.take(effect.effect)) {
    log = getLogPrefix('take', effect);
    log.formatter.addValue(data);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.put(effect.effect)) {
    log = getLogPrefix('put', effect);
    logResult(Object.assign({}, effect, { result: data }), log.formatter);
  } else if (data = _utils.asEffect.call(effect.effect)) {
    log = getLogPrefix('call', effect);
    log.formatter.addCall(data.fn.name, data.args);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.cps(effect.effect)) {
    log = getLogPrefix('cps', effect);
    log.formatter.addCall(data.fn.name, data.args);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.fork(effect.effect)) {
    if (!data.detached) {
      log = getLogPrefix('fork', effect);
    } else {
      log = getLogPrefix('spawn', effect);
    }
    log.formatter.addCall(data.fn.name, data.args);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.join(effect.effect)) {
    log = getLogPrefix('join', effect);
    logResult(effect, log.formatter);
  } else if (data = _utils.asEffect.race(effect.effect)) {
    log = getLogPrefix('race', effect);
    logResult(effect, log.formatter, true);
  } else if (data = _utils.asEffect.cancel(effect.effect)) {
    log = getLogPrefix('cancel', effect);
    log.formatter.appendData(data.name);
  } else if (data = _utils.asEffect.select(effect.effect)) {
    log = getLogPrefix('select', effect);
    log.formatter.addCall(data.selector.name, data.args);
    logResult(effect, log.formatter);
  } else if (_utils.is.array(effect.effect)) {
    log = getLogPrefix('parallel', effect);
    logResult(effect, log.formatter, true);
  } else if (_utils.is.iterator(effect.effect)) {
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

  var isCancel = effect.status === CANCELLED;
  var isError = effect.status === REJECTED;

  var method = isError ? 'error' : 'log';
  var winnerInd = effect && effect.winner ? isError ? '✘' : '✓' : '';

  var style = function style(s) {
    return isCancel ? CANCEL_STYLE : isError ? ERROR_STYLE : s;
  };

  var formatter = logFormatter();

  if (winnerInd) {
    formatter.add('%c ' + winnerInd, style(LABEL_STYLE));
  }
  if (effect && effect.label) {
    formatter.add('%c ' + effect.label + ': ', style(LABEL_STYLE));
  }
  if (type) {
    formatter.add('%c ' + type + ' ', style(EFFECT_TYPE_STYLE));
  }
  formatter.add('%c', style(DEFAULT_STYLE));

  return {
    method: method,
    formatter: formatter
  };
}

function argToString(arg) {
  return typeof arg === 'function' ? '' + arg.name : typeof arg === 'string' ? '\'' + arg + '\'' : arg;
}

function logResult(_ref, formatter, ignoreResult) {
  var status = _ref.status,
      result = _ref.result,
      error = _ref.error,
      duration = _ref.duration;


  if (status === RESOLVED && !ignoreResult) {
    if (_utils.is.array(result)) {
      formatter.addValue(' → ');
      formatter.addValue(result);
    } else {
      formatter.appendData('→', result);
    }
  } else if (status === REJECTED) {
    formatter.appendData('→ ⚠', error);
  } else if (status === PENDING) {
    formatter.appendData('⌛');
  } else if (status === CANCELLED) {
    formatter.appendData('→ Cancelled!');
  }
  if (status !== PENDING) {
    formatter.appendData('(' + duration.toFixed(2) + 'ms)');
  }
}

function isPrimitive(val) {
  return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'symbol' || val === null || val === undefined;
}

function logFormatter() {
  var logs = [];
  var suffix = [];

  function add(msg) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    // Remove the `%c` CSS styling that is not supported by the Node console.
    if (!IS_BROWSER && typeof msg === 'string') {
      var prevMsg = msg;
      msg = msg.replace(/^%c\s*/, '');
      if (msg !== prevMsg) {
        // Remove the first argument which is the CSS style string.
        args.shift();
      }
    }
    logs.push({ msg: msg, args: args });
  }

  function appendData() {
    for (var _len3 = arguments.length, data = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      data[_key3] = arguments[_key3];
    }

    suffix = suffix.concat(data);
  }

  function addValue(value) {
    if (isPrimitive(value)) {
      add(value);
    } else {
      // The browser console supports `%O`, the Node console does not.
      if (IS_BROWSER) {
        add('%O', value);
      } else {
        add('%s', require('util').inspect(value));
      }
    }
  }

  function addCall(name, args) {
    if (!args.length) {
      add(name + '()');
    } else {
      add(name);
      add('(');
      args.forEach(function (arg, i) {
        addValue(argToString(arg));
        addValue(i === args.length - 1 ? ')' : ', ');
      });
    }
  }

  function getLog() {
    var msgs = [],
        msgsArgs = [];
    for (var i = 0; i < logs.length; i++) {
      msgs.push(logs[i].msg);
      msgsArgs = msgsArgs.concat(logs[i].args);
    }
    return [msgs.join('')].concat(msgsArgs).concat(suffix);
  }

  return {
    add: add, addValue: addValue, addCall: addCall, appendData: appendData, getLog: getLog
  };
}

var logSaga = function logSaga() {
  for (var _len4 = arguments.length, topEffects = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    topEffects[_key4] = arguments[_key4];
  }

  if (!topEffects.length) {
    topEffects = rootEffects;
  }
  if (!rootEffects.length) {
    console.log(groupPrefix, 'Saga monitor: No effects to log');
  }
  console.log('');
  console.log('Saga monitor:', Date.now(), new Date().toISOString());
  logEffects(topEffects);
  console.log('');
};

// Export the snapshot-logging function to run from the browser console or extensions.
if (globalScope) {
  globalScope.$$LogSagas = logSaga;
}

// Export the snapshot-logging function for arbitrary use by external code.
exports.logSaga = logSaga;

// Export the `sagaMonitor` to pass to the middleware.

exports.default = {
  effectTriggered: effectTriggered,
  effectResolved: effectResolved,
  effectRejected: effectRejected,
  effectCancelled: effectCancelled,
  actionDispatched: function actionDispatched() {}
};