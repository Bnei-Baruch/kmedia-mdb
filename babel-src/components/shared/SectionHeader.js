'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SectionHeader = function SectionHeader(props) {
  var section = props.section,
      t = props.t;


  return _react2.default.createElement(
    'div',
    { className: 'section-header' },
    _react2.default.createElement(
      _semanticUiReact.Container,
      { className: 'padded' },
      _react2.default.createElement(
        _semanticUiReact.Grid,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid.Row,
          null,
          _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            { computer: 10, tablet: 12, mobile: 16 },
            _react2.default.createElement(
              _semanticUiReact.Header,
              { as: 'h1', color: 'blue' },
              _react2.default.createElement(
                _semanticUiReact.Header.Content,
                null,
                t(section + '.header.text'),
                _react2.default.createElement(
                  _semanticUiReact.Header.Subheader,
                  null,
                  t(section + '.header.subtext')
                )
              )
            )
          )
        )
      )
    )
  );
};

SectionHeader.propTypes = {
  section: _propTypes2.default.string.isRequired,
  t: _propTypes2.default.func.isRequired
};

exports.default = (0, _reactI18next.translate)()(SectionHeader);