'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _TabsMenu = require('../../shared/TabsMenu');

var _TabsMenu2 = _interopRequireDefault(_TabsMenu);

var _Summary = require('./Summary/Summary');

var _Summary2 = _interopRequireDefault(_Summary);

var _SourcesContainer = require('./Sources/SourcesContainer');

var _SourcesContainer2 = _interopRequireDefault(_SourcesContainer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Materials = function (_Component) {
  _inherits(Materials, _Component);

  function Materials() {
    _classCallCheck(this, Materials);

    return _possibleConstructorReturn(this, (Materials.__proto__ || Object.getPrototypeOf(Materials)).apply(this, arguments));
  }

  _createClass(Materials, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          unit = _props.unit,
          t = _props.t;


      if (!unit) {
        return null;
      }

      var items = [{
        name: 'summary',
        label: t('materials.summary.header'),
        component: _react2.default.createElement(_Summary2.default, { unit: this.props.unit, t: t })
      }, {
        name: 'transcription',
        label: t('materials.transcription.header'),
        component: _react2.default.createElement(
          _semanticUiReact.Segment,
          { basic: true },
          t('materials.transcription.header')
        )
      }, {
        name: 'sources',
        label: t('materials.sources.header'),
        component: _react2.default.createElement(_SourcesContainer2.default, { unit: this.props.unit, t: t })
      }, {
        name: 'sketches',
        label: t('materials.sketches.header'),
        component: _react2.default.createElement(
          _semanticUiReact.Segment,
          { basic: true },
          t('materials.sketches.header')
        )
        // component: <div style="outerWidth=200px; outerHeight=200px" visible="true"><Sketches></Sketches></div>,
      }];

      return _react2.default.createElement(_TabsMenu2.default, { items: items });
    }
  }]);

  return Materials;
}(_react.Component);

Materials.propTypes = {
  unit: shapes.ContentUnit,
  t: _propTypes2.default.func.isRequired
};
Materials.defaultProps = {
  unit: undefined
};
exports.default = Materials;