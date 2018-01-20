'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectors = exports.reducer = exports.actions = exports.types = undefined;

var _handleActions;

var _reduxActions = require('redux-actions');

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* Types */

var STOP_EDITING_FILTER = 'Filters/STOP_EDITING_FILTER';
var CLOSE_ACTIVE_FILTER = 'Filters/CLOSE_ACTIVE_FILTER';
var EDIT_NEW_FILTER = 'Filters/EDIT_NEW_FILTER';
var EDIT_EXISTING_FILTER = 'Filters/EDIT_EXISTING_FILTER';

var ADD_FILTER_VALUE = 'Filters/ADD_FILTER_VALUE';
var SET_FILTER_VALUE = 'Filters/SET_FILTER_VALUE';
var REMOVE_FILTER_VALUE = 'Filters/REMOVE_FILTER_VALUE';
var SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
var HYDRATE_FILTERS = 'Filters/HYDRATE_FILTERS';
var FILTERS_HYDRATED = 'Filters/FILTERS_HYDRATED';

var types = exports.types = {
  STOP_EDITING_FILTER: STOP_EDITING_FILTER,
  CLOSE_ACTIVE_FILTER: CLOSE_ACTIVE_FILTER,
  EDIT_NEW_FILTER: EDIT_NEW_FILTER,
  EDIT_EXISTING_FILTER: EDIT_EXISTING_FILTER,

  ADD_FILTER_VALUE: ADD_FILTER_VALUE,
  SET_FILTER_VALUE: SET_FILTER_VALUE,
  REMOVE_FILTER_VALUE: REMOVE_FILTER_VALUE,
  SET_HYDRATED_FILTER_VALUES: SET_HYDRATED_FILTER_VALUES,
  HYDRATE_FILTERS: HYDRATE_FILTERS,
  FILTERS_HYDRATED: FILTERS_HYDRATED
};

/* Actions */

var stopEditingFilter = (0, _reduxActions.createAction)(STOP_EDITING_FILTER, function (namespace, name) {
  return { namespace: namespace, name: name };
});
var closeActiveFilter = (0, _reduxActions.createAction)(CLOSE_ACTIVE_FILTER, function (namespace, name) {
  return { namespace: namespace, name: name };
});
var editNewFilter = (0, _reduxActions.createAction)(EDIT_NEW_FILTER, function (namespace, name) {
  return { namespace: namespace, name: name };
});
var editExistingFilter = (0, _reduxActions.createAction)(EDIT_EXISTING_FILTER, function (namespace, name) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return {
    namespace: namespace,
    name: name,
    index: index
  };
});

var addFilterValue = (0, _reduxActions.createAction)(ADD_FILTER_VALUE, function (namespace, name, value) {
  return {
    namespace: namespace,
    name: name,
    value: value
  };
});
var setFilterValue = (0, _reduxActions.createAction)(SET_FILTER_VALUE, function (namespace, name, value, index) {
  return {
    namespace: namespace,
    name: name,
    value: value,
    index: index
  };
});
var removeFilterValue = (0, _reduxActions.createAction)(REMOVE_FILTER_VALUE, function (namespace, name, value) {
  return {
    namespace: namespace,
    name: name,
    value: value
  };
});

var setHydratedFilterValues = (0, _reduxActions.createAction)(SET_HYDRATED_FILTER_VALUES, function (namespace, filters) {
  return { namespace: namespace, filters: filters };
});
var hydrateFilters = (0, _reduxActions.createAction)(HYDRATE_FILTERS, function (namespace) {
  return { namespace: namespace };
});
var filtersHydrated = (0, _reduxActions.createAction)(FILTERS_HYDRATED, function (namespace) {
  return { namespace: namespace };
});

var actions = exports.actions = {
  stopEditingFilter: stopEditingFilter,
  closeActiveFilter: closeActiveFilter,
  editNewFilter: editNewFilter,
  editExistingFilter: editExistingFilter,

  addFilterValue: addFilterValue,
  setFilterValue: setFilterValue,
  removeFilterValue: removeFilterValue,
  setHydratedFilterValues: setHydratedFilterValues,
  hydrateFilters: hydrateFilters,
  filtersHydrated: filtersHydrated
};

/* Reducer */

var initialState = {};

var setFilterState = function setFilterState(state, namespace, name, newFilterStateReducer) {
  var _ref;

  var oldNamespace = state[namespace] || (_ref = {}, _defineProperty(_ref, name, {}), _defineProperty(_ref, 'activeFilter', ''), _ref);
  if (!oldNamespace[name]) {
    oldNamespace[name] = {};
  }
  var newFilterState = (0, _isFunction2.default)(newFilterStateReducer) ? newFilterStateReducer(oldNamespace[name]) : newFilterStateReducer;

  if (oldNamespace[name] === newFilterState) {
    return state;
  }

  return Object.assign({}, state, _defineProperty({}, namespace, Object.assign({}, oldNamespace, _defineProperty({}, name, Object.assign({}, oldNamespace[name], newFilterState)))));
};

var $$stopEditing = function $$stopEditing(state, action) {
  var _action$payload = action.payload,
      namespace = _action$payload.namespace,
      name = _action$payload.name;

  return setFilterState(state, namespace, name, {
    editingExistingValue: false,
    activeValueIndex: null
  });
};

var $$closeActiveFilter = function $$closeActiveFilter(state, action) {
  var newState = $$stopEditing(state, action);

  newState[action.payload.namespace].activeFilter = '';
  return newState;
};

var $$editNewFilter = function $$editNewFilter(state, action) {
  var _action$payload2 = action.payload,
      namespace = _action$payload2.namespace,
      name = _action$payload2.name;


  var newState = setFilterState(state, namespace, name, function (filterState) {
    return {
      activeValueIndex: Array.isArray(filterState.values) && filterState.values.length > 0 ? filterState.length - 1 : 0,
      editingExistingValue: false
    };
  });
  newState[namespace].activeFilter = name;
  return newState;
};

var $$editExistingFilter = function $$editExistingFilter(state, action) {
  var _action$payload3 = action.payload,
      namespace = _action$payload3.namespace,
      name = _action$payload3.name,
      index = _action$payload3.index;

  var newState = setFilterState(state, namespace, name, {
    activeValueIndex: index,
    editingExistingValue: true
  });

  newState[namespace].activeFilter = name;
  return newState;
};

var $$addFilterValue = function $$addFilterValue(state, action) {
  var _action$payload4 = action.payload,
      namespace = _action$payload4.namespace,
      name = _action$payload4.name,
      value = _action$payload4.value;


  return setFilterState(state, namespace, name, function (filterState) {
    var values = filterState.values || [];
    if (value.length === 0 || values.some(function (v) {
      return (0, _isEqual2.default)(v, value);
    })) {
      return filterState;
    }

    var newValues = values.concat([value]);

    return {
      values: newValues,
      activeValueIndex: null
    };
  });
};

var $$setFilterValue = function $$setFilterValue(state, action) {
  var _action$payload5 = action.payload,
      namespace = _action$payload5.namespace,
      name = _action$payload5.name,
      value = _action$payload5.value,
      index = _action$payload5.index;

  return setFilterState(state, namespace, name, function (filterState) {
    if (typeof index === 'undefined') {
      return { values: [value] };
    }

    var values = filterState.values || [];
    return {
      values: values.slice(0, index).concat([value]).concat(values.slice(index + 1)),
      activeValueIndex: index
    };
  });
};

var $$removeFilterValue = function $$removeFilterValue(state, action) {
  var _action$payload6 = action.payload,
      namespace = _action$payload6.namespace,
      name = _action$payload6.name,
      value = _action$payload6.value;


  return setFilterState(state, namespace, name, function (filterState) {
    var values = filterState.values || [];
    var idx = values.indexOf(value);

    // eslint-disable-next-line no-bitwise
    if (!~idx) {
      return filterState;
    }

    var newValues = values.slice(0, idx).concat(values.slice(idx + 1));

    return { values: newValues };
  });
};

var $$setHydratedFilterValues = function $$setHydratedFilterValues(state, action) {
  var _action$payload7 = action.payload,
      namespace = _action$payload7.namespace,
      filters = _action$payload7.filters;

  var oldNamespace = state[namespace] || {};

  return Object.assign({}, state, _defineProperty({
    isHydrated: Object.assign({}, state.isHydrated, _defineProperty({}, action.payload.namespace, true))
  }, namespace, Object.assign({}, Object.keys(filters).reduce(function (acc, name) {
    var value = filters[name];
    acc[name] = Object.assign({}, oldNamespace[name], {
      values: Array.isArray(value) ? value : [value]
    });
    return acc;
  }, {}))));
};

var $$hydrateFilters = function $$hydrateFilters(state, action) {
  return Object.assign({}, state, {
    isHydrated: Object.assign({}, state.isHydrated, _defineProperty({}, action.payload.namespace, false))
  });
};

var $$filtersHydrated = function $$filtersHydrated(state, action) {
  return Object.assign({}, state, {
    isHydrated: Object.assign({}, state.isHydrated, _defineProperty({}, action.payload.namespace, false))
  });
};

var reducer = exports.reducer = (0, _reduxActions.handleActions)((_handleActions = {}, _defineProperty(_handleActions, STOP_EDITING_FILTER, $$stopEditing), _defineProperty(_handleActions, CLOSE_ACTIVE_FILTER, $$closeActiveFilter), _defineProperty(_handleActions, EDIT_NEW_FILTER, $$editNewFilter), _defineProperty(_handleActions, EDIT_EXISTING_FILTER, $$editExistingFilter), _defineProperty(_handleActions, ADD_FILTER_VALUE, $$addFilterValue), _defineProperty(_handleActions, SET_FILTER_VALUE, $$setFilterValue), _defineProperty(_handleActions, REMOVE_FILTER_VALUE, $$removeFilterValue), _defineProperty(_handleActions, SET_HYDRATED_FILTER_VALUES, $$setHydratedFilterValues), _defineProperty(_handleActions, HYDRATE_FILTERS, $$hydrateFilters), _defineProperty(_handleActions, FILTERS_HYDRATED, $$filtersHydrated), _handleActions), initialState);

/* Selectors */
var getFilters = function getFilters(state, namespace) {
  var filters = state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).filter(function (filterName) {
    return filterName !== 'activeFilter';
  }).map(function (filterName) {
    return Object.assign({
      name: filterName
    }, filters[filterName]);
  });
};

var getFilterAllValues = function getFilterAllValues(state, namespace, name) {
  return state[namespace] && state[namespace][name] && state[namespace][name].values;
};

var getFilterValue = function getFilterValue(state, namespace, name) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return getFilterAllValues(state, namespace, name, index) && state[namespace][name].values[index];
};

var getLastFilterValue = function getLastFilterValue(state, namespace, name) {
  if (state[namespace] && state[namespace][name] && state[namespace][name].values && state[namespace][name].values.length > 0) {
    var values = state[namespace][name].values;
    return values[values.length - 1];
  }

  return undefined;
};

var getActiveValueIndex = function getActiveValueIndex(state, namespace, name) {
  return state[namespace] && state[namespace][name] && state[namespace][name].activeValueIndex;
};

var getActiveValue = function getActiveValue(state, namespace, name) {
  return getFilterValue(state, namespace, name, getActiveValueIndex(state, namespace, name)) || getLastFilterValue(state, namespace, name);
};

var getIsEditingExistingFilter = function getIsEditingExistingFilter(state, namespace, name) {
  return state[namespace] && state[namespace][name] && state[namespace][name].editingExistingValue;
};

var getIsHydrated = function getIsHydrated(state, namespace) {
  return !!state.isHydrated && !!state.isHydrated[namespace];
};

var getActiveFilter = function getActiveFilter(state, namespace) {
  return state[namespace] && state[namespace].activeFilter ? state[namespace].activeFilter : '';
};

var selectors = exports.selectors = {
  getFilters: getFilters,
  getFilterValue: getFilterValue,
  getFilterAllValues: getFilterAllValues,
  getLastFilterValue: getLastFilterValue,
  getActiveValueIndex: getActiveValueIndex,
  getActiveValue: getActiveValue,
  getIsEditingExistingFilter: getIsEditingExistingFilter,
  getIsHydrated: getIsHydrated,
  getActiveFilter: getActiveFilter
};