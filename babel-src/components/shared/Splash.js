'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorSplash = exports.FrownSplash = exports.LoadingSplash = exports.Splash = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Splash = exports.Splash = function Splash(props) {
  var text = props.text,
      subtext = props.subtext,
      icon = props.icon,
      color = props.color,
      isLoading = props.isLoading;


  return _react2.default.createElement(
    _semanticUiReact.Header,
    { as: 'h2', icon: true, textAlign: 'center' },
    _react2.default.createElement(_semanticUiReact.Icon, { name: icon, loading: isLoading, color: color }),
    _react2.default.createElement(
      _semanticUiReact.Header.Content,
      null,
      text,
      subtext ? _react2.default.createElement(
        _semanticUiReact.Header.Subheader,
        null,
        subtext
      ) : null
    )
  );
};

Splash.propTypes = {
  icon: _propTypes2.default.string.isRequired,
  text: _propTypes2.default.node.isRequired,
  subtext: _propTypes2.default.node,
  color: _propTypes2.default.string,
  isLoading: _propTypes2.default.bool
};

Splash.defaultProps = {
  text: '',
  subtext: null,
  color: 'black',
  isLoading: false
};

var LoadingSplash = exports.LoadingSplash = function LoadingSplash(props) {
  return _react2.default.createElement(Splash, Object.assign({ isLoading: true, icon: 'spinner' }, props));
};
var FrownSplash = exports.FrownSplash = function FrownSplash(props) {
  return _react2.default.createElement(Splash, Object.assign({ icon: 'frown', color: 'orange' }, props));
};
var ErrorSplash = exports.ErrorSplash = function ErrorSplash(props) {
  return _react2.default.createElement(Splash, Object.assign({ icon: 'warning sign', color: 'red' }, props));
};