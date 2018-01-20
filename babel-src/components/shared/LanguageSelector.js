'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../helpers/consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LanguageSelector = function LanguageSelector(props) {
  var languages = props.languages,
      defaultValue = props.defaultValue,
      onSelect = props.onSelect,
      t = props.t;


  var options = _consts.LANGUAGE_OPTIONS.filter(function (x) {
    return languages.includes(x.value);
  }).map(function (x) {
    return Object.assign({}, x, { text: t('constants.languages.' + x.value) });
  });

  return _react2.default.createElement(_semanticUiReact.Dropdown, {
    fluid: true,
    item: true,
    labeled: true,
    selection: true,
    scrolling: true,
    defaultValue: defaultValue,
    options: options,
    onChange: function onChange(e, _ref) {
      var value = _ref.value;
      return onSelect(e, value);
    }
  });
};

LanguageSelector.propTypes = {
  onSelect: _propTypes2.default.func,
  defaultValue: _propTypes2.default.string,
  languages: _propTypes2.default.arrayOf(_propTypes2.default.string),
  t: _propTypes2.default.func.isRequired
};

LanguageSelector.defaultProps = {
  onSelect: _noop2.default,
  defaultValue: _consts.LANG_HEBREW,
  languages: []
};

exports.default = (0, _reactI18next.translate)()(LanguageSelector);