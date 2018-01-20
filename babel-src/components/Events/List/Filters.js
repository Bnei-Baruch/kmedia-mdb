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

var _Filters = require('../../Filters/Filters');

var _Filters2 = _interopRequireDefault(_Filters);

var _filterComponents = require('../../Filters/filterComponents');

var _filterComponents2 = _interopRequireDefault(_filterComponents);

var _FiltersHydrator = require('../../Filters/FiltersHydrator/FiltersHydrator');

var _FiltersHydrator2 = _interopRequireDefault(_FiltersHydrator);

var _FilterTags = require('../../Filters/FilterTags/FilterTags');

var _FilterTags2 = _interopRequireDefault(_FilterTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var filters = [{
  name: 'event-types-filter',
  component: _filterComponents2.default.EventTypesFilter
}, {
  name: 'years-filter',
  component: _filterComponents2.default.YearsFilter
}];

var EventsFilter = function (_PureComponent) {
  _inherits(EventsFilter, _PureComponent);

  function EventsFilter() {
    _classCallCheck(this, EventsFilter);

    return _possibleConstructorReturn(this, (EventsFilter.__proto__ || Object.getPrototypeOf(EventsFilter)).apply(this, arguments));
  }

  _createClass(EventsFilter, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          onChange = _props.onChange,
          onHydrated = _props.onHydrated;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_FiltersHydrator2.default, { namespace: 'events', onHydrated: onHydrated }),
        _react2.default.createElement(_Filters2.default, { namespace: 'events', filters: filters, onFilterApplication: onChange }),
        _react2.default.createElement(_FilterTags2.default, { namespace: 'events', onClose: onChange })
      );
    }
  }]);

  return EventsFilter;
}(_react.PureComponent);

EventsFilter.propTypes = {
  onChange: _propTypes2.default.func,
  onHydrated: _propTypes2.default.func
};
EventsFilter.defaultProps = {
  onChange: _noop2.default,
  onHydrated: _noop2.default
};
exports.default = EventsFilter;