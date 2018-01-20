'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _events = require('../../../redux/modules/events');

var _settings = require('../../../redux/modules/settings');

var _mdb = require('../../../redux/modules/mdb');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _EventItem = require('./EventItem');

var _EventItem2 = _interopRequireDefault(_EventItem);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventItemContainer = function (_Component) {
  _inherits(EventItemContainer, _Component);

  function EventItemContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, EventItemContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EventItemContainer.__proto__ || Object.getPrototypeOf(EventItemContainer)).call.apply(_ref, [this].concat(args))), _this), _this.askForDataIfNeeded = function (props) {
      var match = props.match,
          item = props.item,
          wip = props.wip,
          err = props.err,
          fetchEventItem = props.fetchEventItem;

      // We fetch stuff if we don't have it already
      // and a request for it is not in progress or ended with an error.

      if (wip || err) {
        return;
      }

      var id = match.params.id;
      if (item && item.id === id && Array.isArray(item.files)) {
        return;
      }

      fetchEventItem(id);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EventItemContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.askForDataIfNeeded(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.askForDataIfNeeded(nextProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          language = _props.language,
          item = _props.item,
          wip = _props.wip,
          err = _props.err;

      return _react2.default.createElement(_EventItem2.default, {
        item: wip || err ? null : item,
        language: language,
        wip: wip,
        err: err
      });
    }
  }]);

  return EventItemContainer;
}(_react.Component);

EventItemContainer.propTypes = {
  match: shapes.RouterMatch.isRequired,
  language: _propTypes2.default.string.isRequired,
  item: shapes.EventItem,
  wip: shapes.WIP,
  err: shapes.Error,
  fetchEventItem: _propTypes2.default.func.isRequired
};
EventItemContainer.defaultProps = {
  item: null,
  wip: false,
  err: null
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  var id = ownProps.match.params.id;
  return {
    item: _mdb.selectors.getDenormContentUnit(state.mdb, id),
    wip: _events.selectors.getWip(state.events).items[id],
    err: _events.selectors.getErrors(state.events).items[id],
    language: _settings.selectors.getLanguage(state.settings)
  };
}, function (dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchEventItem: _events.actions.fetchEventItem
  }, dispatch);
})(EventItemContainer);