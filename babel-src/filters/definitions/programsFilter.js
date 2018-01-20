'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var _mdb = require('../../redux/modules/mdb');

var _utils = require('../../helpers/utils');

var programsFilter = {
  name: 'programs-filter',
  queryKey: 'program',
  valueToQuery: function valueToQuery(value) {
    return [value.genre, value.program].map(function (x) {
      return x ? x : '';
    }).join('|');
  },
  queryToValue: function queryToValue(queryValue) {
    var _queryValue$split = queryValue.split('|'),
        _queryValue$split2 = _slicedToArray(_queryValue$split, 2),
        genre = _queryValue$split2[0],
        program = _queryValue$split2[1];

    return { genre: genre, program: program };
  },
  valueToApiParam: function valueToApiParam(value) {
    return value;
  },
  tagIcon: 'tv',
  valueToTagLabel: function valueToTagLabel(value, props, store, t) {
    if (!value) {
      return '';
    }

    var programName = value.program;
    if (!(0, _utils.isEmpty)(programName)) {
      var program = _mdb.selectors.getCollectionById(store.getState().mdb, programName);
      return program ? program.name : programName;
    }

    var genre = value.genre;
    if (!(0, _utils.isEmpty)(genre)) {
      return t('programs.genres.' + genre);
    }

    return '';
  }
};

exports.default = (0, _util.createFilterDefinition)(programsFilter);