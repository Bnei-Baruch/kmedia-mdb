'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _reactI18next = require('react-i18next');

var _filters = require('../../redux/modules/filters');

var _settings = require('../../redux/modules/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var connectFilter = function connectFilter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (WrappedComponent) {
    var isMultiple = options.isMultiple;

    var ConnectFilterHOC = function (_Component) {
      _inherits(ConnectFilterHOC, _Component);

      function ConnectFilterHOC() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ConnectFilterHOC);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ConnectFilterHOC.__proto__ || Object.getPrototypeOf(ConnectFilterHOC)).call.apply(_ref, [this].concat(args))), _this), _this.updateValue = function (value) {
          var _this$props = _this.props,
              isEditing = _this$props.isEditing,
              activeValueIndex = _this$props.activeValueIndex,
              namespace = _this$props.namespace,
              name = _this$props.name;

          if (isEditing) {
            _this.props.setFilterValue(namespace, name, value, activeValueIndex);
          } else if (isMultiple) {
            _this.props.addFilterValue(namespace, name, value);
          } else {
            _this.props.setFilterValue(namespace, name, value);
          }
        }, _this.removeValue = function () {
          var _this$props2 = _this.props,
              namespace = _this$props2.namespace,
              name = _this$props2.name,
              activeValueIndex = _this$props2.activeValueIndex,
              removeFilterValue = _this$props2.removeFilterValue;

          removeFilterValue(namespace, name, activeValueIndex);
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(ConnectFilterHOC, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _props = this.props,
              name = _props.name,
              namespace = _props.namespace,
              stopEditingFilter = _props.stopEditingFilter;

          stopEditingFilter(namespace, name);
        }
      }, {
        key: 'render',
        value: function render() {
          // eslint-disable-next-line no-unused-vars
          var _props2 = this.props,
              addFilterValue = _props2.addFilterValue,
              setFilterValue = _props2.setFilterValue,
              removeFilterValue = _props2.removeFilterValue,
              rest = _objectWithoutProperties(_props2, ['addFilterValue', 'setFilterValue', 'removeFilterValue']);

          return _react2.default.createElement(WrappedComponent, Object.assign({
            updateValue: this.updateValue,
            removeValue: this.removeValue
          }, rest));
        }
      }]);

      return ConnectFilterHOC;
    }(_react.Component);

    ConnectFilterHOC.propTypes = {
      namespace: _propTypes2.default.string.isRequired,
      name: _propTypes2.default.string.isRequired,
      stopEditingFilter: _propTypes2.default.func.isRequired,
      setFilterValue: _propTypes2.default.func.isRequired,
      addFilterValue: _propTypes2.default.func.isRequired,
      removeFilterValue: _propTypes2.default.func.isRequired,
      t: _propTypes2.default.func.isRequired,
      language: _propTypes2.default.string.isRequired,
      activeValueIndex: _propTypes2.default.number,
      isEditing: _propTypes2.default.bool
    };
    ConnectFilterHOC.defaultProps = {
      activeValueIndex: undefined,
      isEditing: false
    };


    return (0, _reactRedux.connect)(function (state, ownProps) {
      return {
        isEditing: _filters.selectors.getIsEditingExistingFilter(state.filters, ownProps.namespace, ownProps.name),
        activeValueIndex: _filters.selectors.getActiveValueIndex(state.filters, ownProps.namespace, ownProps.name),
        value: _filters.selectors.getActiveValue(state.filters, ownProps.namespace, ownProps.name),
        allValues: _filters.selectors.getFilterAllValues(state.filters, ownProps.namespace, ownProps.name),
        language: _settings.selectors.getLanguage(state.settings)
      };
    }, _filters.actions)((0, _reactI18next.translate)()(ConnectFilterHOC));

    // TODO (yaniv): change displayName
  };
};

exports.default = connectFilter;