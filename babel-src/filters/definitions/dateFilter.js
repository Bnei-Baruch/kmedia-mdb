'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _consts = require('../../helpers/consts');

var _date = require('../../helpers/date');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dateFilter = {
  name: 'date-filter',
  queryKey: 'dates',
  valueToQuery: function valueToQuery(value) {
    if (!value) {
      return null;
    }

    return (0, _moment2.default)(value.from).format(_consts.DATE_FORMAT) + '_' + (0, _moment2.default)(value.to).format(_consts.DATE_FORMAT);
  },
  queryToValue: function queryToValue(queryValue) {
    var parts = queryValue.split('_');

    return {
      from: (0, _moment2.default)(parts[0], _consts.DATE_FORMAT).toDate(),
      to: (0, _moment2.default)(parts[1], _consts.DATE_FORMAT).toDate()
    };
  },
  valueToApiParam: function valueToApiParam(value) {
    var from = value.from,
        to = value.to;

    return {
      start_date: (0, _moment2.default)(new Date(from)).format(_consts.DATE_FORMAT),
      end_date: (0, _moment2.default)(new Date(to)).format(_consts.DATE_FORMAT)
    };
  },
  tagIcon: 'calendar',
  valueToTagLabel: function valueToTagLabel(value) {
    if (!value) {
      return '';
    }

    var from = value.from,
        to = value.to;

    var dateFormat = function dateFormat(date) {
      return (0, _moment2.default)(new Date(date)).format('D MMM YYYY');
    };

    if ((0, _date.sameDate)(value.from, value.to)) {
      return dateFormat(from);
    }

    return dateFormat(from) + ' - ' + dateFormat(to);
  }
};

exports.default = (0, _util.createFilterDefinition)(dateFilter);