'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AVShare = function AVShare() {
  return _react2.default.createElement(_semanticUiReact.Button, {
    type: 'button',
    primary: true,
    size: 'big',
    circular: true,
    icon: 'share alternate'
  });
};

exports.default = AVShare;