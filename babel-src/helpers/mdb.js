'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionsBreakdown = undefined;

var _consts = require('./consts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CollectionsBreakdown = exports.CollectionsBreakdown = function CollectionsBreakdown(collections) {
  var _this = this;

  _classCallCheck(this, CollectionsBreakdown);

  this.getDailyLessons = function () {
    return _this.collectTypes(_consts.CT_DAILY_LESSON, _consts.CT_SPECIAL_LESSON);
  };

  this.getEvents = function () {
    return _this.collectTypes(_consts.CT_CONGRESS, _consts.CT_HOLIDAY, _consts.CT_PICNIC, _consts.CT_UNITY_DAY);
  };

  this.getPrograms = function () {
    return _this.collectTypes(_consts.CT_VIDEO_PROGRAM);
  };

  this.getAllButDailyLessons = function () {
    return _this.collectTypes(_consts.CT_FRIENDS_GATHERINGS, _consts.CT_VIDEO_PROGRAM, _consts.CT_LECTURE_SERIES, _consts.CT_CHILDREN_LESSONS, _consts.CT_WOMEN_LESSONS, _consts.CT_VIRTUAL_LESSONS, _consts.CT_MEALS, _consts.CT_CONGRESS, _consts.CT_HOLIDAY, _consts.CT_PICNIC, _consts.CT_UNITY_DAY);
  };

  this.getAllButPrograms = function () {
    return _this.collectTypes(_consts.CT_DAILY_LESSON, _consts.CT_SPECIAL_LESSON, _consts.CT_FRIENDS_GATHERINGS, _consts.CT_LECTURE_SERIES, _consts.CT_CHILDREN_LESSONS, _consts.CT_WOMEN_LESSONS, _consts.CT_VIRTUAL_LESSONS, _consts.CT_MEALS, _consts.CT_CONGRESS, _consts.CT_HOLIDAY, _consts.CT_PICNIC, _consts.CT_UNITY_DAY);
  };

  this.collectTypes = function () {
    for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    return types.reduce(function (acc, val) {
      return acc.concat(_this.byType[val] || []);
    }, []);
  };

  this.byType = (collections || []).reduce(function (acc, val) {
    var vals = acc[val.content_type];
    if (Array.isArray(vals)) {
      vals.push(val);
    } else {
      acc[val.content_type] = [val];
    }
    return acc;
  }, {});
};