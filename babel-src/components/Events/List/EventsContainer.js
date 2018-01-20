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

var _settings = require('../../../redux/modules/settings');

var _filters = require('../../../redux/modules/filters');

var _events = require('../../../redux/modules/events');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventsContainer = function (_Component) {
  _inherits(EventsContainer, _Component);

  function EventsContainer() {
    _classCallCheck(this, EventsContainer);

    return _possibleConstructorReturn(this, (EventsContainer.__proto__ || Object.getPrototypeOf(EventsContainer)).apply(this, arguments));
  }

  _createClass(EventsContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          hasItems = _props.hasItems,
          fetchAllEvents = _props.fetchAllEvents,
          wip = _props.wip,
          err = _props.err;

      // We only fetch one time on first mount, if not wip or error.
      // Next time we fetch is on language change.

      if (!hasItems && !(wip || err)) {
        fetchAllEvents();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var language = nextProps.language;


      if (language !== this.props.language) {
        nextProps.fetchAllEvents();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          filteredItems = _props2.filteredItems,
          wip = _props2.wip,
          err = _props2.err;

      return _react2.default.createElement(_Events2.default, { items: filteredItems, wip: wip, err: err });
    }
  }]);

  return EventsContainer;
}(_react.Component);

EventsContainer.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  language: _propTypes2.default.string.isRequired,
  fetchAllEvents: _propTypes2.default.func.isRequired,
  filteredItems: _propTypes2.default.arrayOf(shapes.EventCollection),
  hasItems: _propTypes2.default.bool,
  wip: shapes.WIP,
  err: shapes.Error
};
EventsContainer.defaultProps = {
  hasItems: false,
  filteredItems: [],
  wip: false,
  err: null
};


var mapState = function mapState(state) {
  var filters = _filters.selectors.getFilters(state.filters, 'events');
  var filteredItems = _events.selectors.getFilteredData(state.events, filters, state.mdb);

  return {
    filteredItems: filteredItems,
    hasItems: filteredItems.length > 0,
    language: _settings.selectors.getLanguage(state.settings),
    wip: _events.selectors.getWip(state.events).list,
    err: _events.selectors.getErrors(state.events).list
  };
};

exports.default = (0, _reactRedux.connect)(mapState, _events.actions)(EventsContainer);