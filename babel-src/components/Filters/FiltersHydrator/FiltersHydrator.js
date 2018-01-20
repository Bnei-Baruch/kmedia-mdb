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

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _filters = require('../../../redux/modules/filters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FiltersHydrator = function (_Component) {
  _inherits(FiltersHydrator, _Component);

  function FiltersHydrator() {
    _classCallCheck(this, FiltersHydrator);

    return _possibleConstructorReturn(this, (FiltersHydrator.__proto__ || Object.getPrototypeOf(FiltersHydrator)).apply(this, arguments));
  }

  _createClass(FiltersHydrator, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Filters hydration cycle starts here
      this.props.hydrateFilters(this.props.namespace);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var isHydrated = nextProps.isHydrated,
          onHydrated = nextProps.onHydrated,
          namespace = nextProps.namespace,
          filtersHydrated = nextProps.filtersHydrated;

      // isHydrated changed from false to true.

      if (!this.props.isHydrated && isHydrated) {

        // End the hydration cycle.
        // Everything is updated, sagas, redux, react. Down to here.
        filtersHydrated(namespace);

        // callback our event prop
        onHydrated(namespace);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', null);
    }
  }]);

  return FiltersHydrator;
}(_react.Component);

FiltersHydrator.propTypes = {
  hydrateFilters: _propTypes2.default.func.isRequired,
  filtersHydrated: _propTypes2.default.func.isRequired,
  namespace: _propTypes2.default.string.isRequired,
  onHydrated: _propTypes2.default.func,
  isHydrated: _propTypes2.default.bool
};
FiltersHydrator.defaultProps = {
  onHydrated: _noop2.default,
  isHydrated: false
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    isHydrated: _filters.selectors.getIsHydrated(state.filters, ownProps.namespace)
  };
}, _filters.actions)(FiltersHydrator);