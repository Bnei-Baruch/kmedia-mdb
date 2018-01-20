'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _semanticUiReact = require('semantic-ui-react');

var _connectFilter = require('../connectFilter');

var _connectFilter2 = _interopRequireDefault(_connectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buildYearOptions = function buildYearOptions(fromYear, toYear) {
  var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  return (0, _range2.default)(fromYear, toYear, order).map(function (year) {
    return {
      value: year,
      text: year
    };
  });
};

var YearsFilter = function (_React$Component) {
  _inherits(YearsFilter, _React$Component);

  function YearsFilter() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, YearsFilter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = YearsFilter.__proto__ || Object.getPrototypeOf(YearsFilter)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      year: _this.props.value
    }, _this.onSelectionChange = function (event, data) {
      var value = data.value;

      _this.setState({ year: value });
    }, _this.onCancel = function () {
      _this.props.onCancel();
    }, _this.apply = function () {
      _this.props.updateValue(_this.state.year);
      _this.props.onApply();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(YearsFilter, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        year: nextProps.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          fromYear = _props.fromYear,
          toYear = _props.toYear,
          t = _props.t;
      var year = this.state.year;


      return _react2.default.createElement(
        _semanticUiReact.Segment,
        { basic: true, clearing: true, attached: 'bottom', className: 'tab active' },
        _react2.default.createElement(_semanticUiReact.Dropdown, {
          selection: true,
          value: year,
          placeholder: t('filters.years-filter.placeholder'),
          options: buildYearOptions(toYear, fromYear),
          onChange: this.onSelectionChange
        }),
        _react2.default.createElement(_semanticUiReact.Divider, null),
        _react2.default.createElement(
          _semanticUiReact.Segment,
          { vertical: true, clearing: true },
          _react2.default.createElement(_semanticUiReact.Button, {
            primary: true,
            content: t('buttons.apply'),
            floated: 'right',
            disabled: !year,
            onClick: this.apply
          }),
          _react2.default.createElement(_semanticUiReact.Button, {
            content: t('buttons.cancel'),
            floated: 'right',
            onClick: this.onCancel
          })
        )
      );
    }
  }]);

  return YearsFilter;
}(_react2.default.Component);

YearsFilter.propTypes = {
  onCancel: _propTypes2.default.func,
  onApply: _propTypes2.default.func,
  updateValue: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.number,
  t: _propTypes2.default.func.isRequired,
  namespace: _propTypes2.default.string.isRequired,
  fromYear: _propTypes2.default.number,
  toYear: _propTypes2.default.number
};
YearsFilter.defaultProps = {
  onCancel: _noop2.default,
  onApply: _noop2.default,
  value: null,
  allValues: [],
  fromYear: 1995,
  toYear: new Date().getFullYear()
};
exports.default = (0, _connectFilter2.default)()(YearsFilter);