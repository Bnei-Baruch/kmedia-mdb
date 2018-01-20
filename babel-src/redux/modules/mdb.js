'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _reduxActions = require('redux-actions');

var _system = require('./system');

var _settings = require('./settings');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var RECEIVE_COLLECTIONS = 'MDB/RECEIVE_COLLECTIONS';
var RECEIVE_CONTENT_UNITS = 'MDB/RECEIVE_CONTENT_UNITS';

var types = exports.types = {
  RECEIVE_COLLECTIONS: RECEIVE_COLLECTIONS,
  RECEIVE_CONTENT_UNITS: RECEIVE_CONTENT_UNITS
};

/* Actions */

var receiveCollections = (0, _reduxActions.createAction)(RECEIVE_COLLECTIONS);
var receiveContentUnits = (0, _reduxActions.createAction)(RECEIVE_CONTENT_UNITS);

var actions = exports.actions = {
  receiveCollections: receiveCollections,
  receiveContentUnits: receiveContentUnits
};

/* Reducer */

var freshStore = function freshStore() {
  return {
    cById: {},
    cuById: {}
  };
};

var onReceiveCollections = function onReceiveCollections(state, action) {
  var items = action.payload || [];

  if (items.length === 0) {
    return state;
  }

  var cById = Object.assign({}, state.cById);
  var cuById = Object.assign({}, state.cuById);
  items.forEach(function (x) {
    // make a copy of incoming data since we're about to mutate it
    var y = Object.assign({}, x);

    // normalize content units
    if (y.content_units) {
      y.ccuNames = y.ccuNames || {};
      y.cuIDs = y.content_units.map(function (cu) {
        var ccuName = cu.name_in_collection;
        y.ccuNames[cu.id] = ccuName;

        // make a copy of content unit and set this collection ccuName
        var updatedCU = Object.assign({}, cu, state.cuById[cu.id]);
        updatedCU.cIDs = Object.assign({}, updatedCU.cIDs, _defineProperty({}, y.id + '____' + ccuName, y.id));

        // we delete it's name_in_collection
        // as it might be overridden by successive calls from different collections
        delete updatedCU.name_in_collection;

        cuById[cu.id] = updatedCU;

        return cu.id;
      });
      delete y.content_units;
    }

    // update collection in store
    cById[y.id] = Object.assign({}, state.cById[y.id], y);
  });
  return Object.assign({}, state, {
    cById: cById,
    cuById: cuById
  });
};

var onReceiveContentUnits = function onReceiveContentUnits(state, action) {
  var items = action.payload || [];

  if (items.length === 0) {
    return state;
  }

  var cById = Object.assign({}, state.cById);
  var cuById = Object.assign({}, state.cuById);
  items.forEach(function (x) {
    // make a copy of incoming data since we're about to mutate it
    var y = Object.assign({}, x);

    // normalize collections
    if (y.collections) {
      y.cIDs = Object.entries(y.collections).reduce(function (acc, val) {
        var _val = _slicedToArray(val, 2),
            k = _val[0],
            v = _val[1];

        var _k$split = k.split('____'),
            _k$split2 = _slicedToArray(_k$split, 2),
            cID = _k$split2[0],
            ccuName = _k$split2[1];

        // make a copy of collection and set this unit ccuName


        var updatedC = Object.assign({}, v, state.cById[v.id]);
        if (updatedC.cuIDs) {
          if (updatedC.cuIDs.findIndex(function (z) {
            return z === y.id;
          }) === -1) {
            updatedC.cuIDs = [].concat(_toConsumableArray(updatedC.cuIDs), [y.id]);
          }
        } else {
          updatedC.cuIDs = [y.id];
        }
        updatedC.ccuNames = Object.assign({}, updatedC.ccuNames, _defineProperty({}, y.id, ccuName));
        cById[v.id] = updatedC;

        acc[k] = cID;
        return acc;
      }, {});
      delete y.collections;
    }

    // normalize derived content units
    if (y.derived_units) {
      y.dduIDs = Object.entries(y.derived_units).reduce(function (acc, val) {
        var _val2 = _slicedToArray(val, 2),
            k = _val2[0],
            v = _val2[1];

        var _k$split3 = k.split('____'),
            _k$split4 = _slicedToArray(_k$split3, 2),
            cuID = _k$split4[0],
            relName = _k$split4[1];

        // make a copy of derived unit and set this unit as source name


        var updatedDU = Object.assign({}, v, state.cuById[v.id]);
        updatedDU.sduIDs = Object.assign({}, updatedDU.sduIDs, _defineProperty({}, y.id, relName));
        cuById[v.id] = updatedDU;

        acc[k] = cuID;
        return acc;
      }, {});
      delete y.derived_units;
    }

    // normalize source content units
    if (y.source_units) {
      y.sduIDs = Object.entries(y.source_units).reduce(function (acc, val) {
        var _val3 = _slicedToArray(val, 2),
            k = _val3[0],
            v = _val3[1];

        var _k$split5 = k.split('____'),
            _k$split6 = _slicedToArray(_k$split5, 2),
            cuID = _k$split6[0],
            relName = _k$split6[1];

        // make a copy of source unit and set this unit as derived name


        var updatedDU = Object.assign({}, v, state.cuById[v.id]);
        updatedDU.dduIDs = Object.assign({}, updatedDU.dduIDs, _defineProperty({}, y.id, relName));
        cuById[v.id] = updatedDU;

        acc[k] = cuID;
        return acc;
      }, {});
      delete y.source_units;
    }

    cuById[y.id] = Object.assign({}, state.cuById[y.id], y);
  });
  return Object.assign({}, state, {
    cById: cById,
    cuById: cuById
  });
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, _system.types.INIT, function () {
  return freshStore();
}), _defineProperty(_handleActions, _settings.types.SET_LANGUAGE, function () {
  return freshStore();
}), _defineProperty(_handleActions, RECEIVE_COLLECTIONS, function (state, action) {
  return onReceiveCollections(state, action);
}), _defineProperty(_handleActions, RECEIVE_CONTENT_UNITS, function (state, action) {
  return onReceiveContentUnits(state, action);
}), _handleActions), freshStore());

/* Selectors */

var getCollectionById = function getCollectionById(state, id) {
  return state.cById[id];
};
var getUnitById = function getUnitById(state, id) {
  return state.cuById[id];
};

var getDenormCollection = function getDenormCollection(state, id) {
  var c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    c.content_units = c.cuIDs.map(function (x) {
      return state.cuById[x];
    }).filter(function (x) {
      return !!x;
    });
  }
  return c;
};

var denormalizeObject = function denormalizeObject(byID, obj) {
  return Object.entries(obj || {}).reduce(function (acc, val) {
    var _val4 = _slicedToArray(val, 2),
        k = _val4[0],
        v = _val4[1];

    var c = byID[v];
    if (c) {
      acc[k] = c;
    }
    return acc;
  }, {});
};

var getDenormContentUnit = function getDenormContentUnit(state, id) {
  var cu = state.cuById[id];

  if (cu) {
    // denormalize collections
    cu.collections = denormalizeObject(state.cById, cu.cIDs);

    // denormalize derived units
    cu.derived_units = denormalizeObject(state.cuById, cu.dduIDs);

    // denormalize source units
    cu.source_units = denormalizeObject(state.cuById, cu.sduIDs);
  }

  return cu;
};

var getDenormCollectionWUnits = function getDenormCollectionWUnits(state, id) {
  var c = state.cById[id];
  if (c && Array.isArray(c.cuIDs)) {
    c.content_units = c.cuIDs.map(function (x) {
      return getDenormContentUnit(state, x);
    }).filter(function (x) {
      return !!x;
    });
  }
  return c;
};

var selectors = exports.selectors = {
  getCollectionById: getCollectionById,
  getUnitById: getUnitById,
  getDenormCollection: getDenormCollection,
  getDenormCollectionWUnits: getDenormCollectionWUnits,
  getDenormContentUnit: getDenormContentUnit
};