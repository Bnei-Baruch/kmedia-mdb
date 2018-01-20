'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _system = require('./modules/system');

var _settings = require('./modules/settings');

var _lessons = require('./modules/lessons');

var _events = require('./modules/events');

var _programs = require('./modules/programs');

var _filters = require('./modules/filters');

var _sources = require('./modules/sources');

var _tags = require('./modules/tags');

var _mdb = require('./modules/mdb');

var _search = require('./modules/search');

exports.default = (0, _redux.combineReducers)({
  router: _reactRouterRedux.routerReducer,
  system: _system.reducer,
  settings: _settings.reducer,
  lessons: _lessons.reducer,
  programs: _programs.reducer,
  events: _events.reducer,
  filters: _filters.reducer,
  sources: _sources.reducer,
  tags: _tags.reducer,
  mdb: _mdb.reducer,
  search: _search.reducer
});