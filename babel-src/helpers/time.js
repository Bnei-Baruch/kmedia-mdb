'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var formatTime = exports.formatTime = function formatTime(current) {
  if (!current) return '00:00';

  var h = Math.floor(current / 3600);
  var m = Math.floor((current - h * 3600) / 60);
  var s = Math.floor(current % 60);
  var result = [];

  if (h > 0) {
    result.push(h < 10 ? '0' + h : '' + h);
  }
  result.push(m < 10 ? '0' + m : '' + m);
  result.push(s < 10 ? '0' + s : '' + s);

  return result.join(':');
};