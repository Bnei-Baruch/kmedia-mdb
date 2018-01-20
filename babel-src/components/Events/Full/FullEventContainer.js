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

var _mdb = require('../../../redux/modules/mdb');

var _settings = require('../../../redux/modules/settings');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _FullEvent = require('./FullEvent');

var _FullEvent2 = _interopRequireDefault(_FullEvent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullEventContainer = function (_Component) {
  _inherits(FullEventContainer, _Component);

  function FullEventContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullEventContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullEventContainer.__proto__ || Object.getPrototypeOf(FullEventContainer)).call.apply(_ref, [this].concat(args))), _this), _this.askForDataIfNeeded = function (props) {
      var match = props.match,
          fullEvent = props.fullEvent,
          wip = props.wip,
          errors = props.errors,
          fetchFullEvent = props.fetchFullEvent,
          fetchEventItem = props.fetchEventItem;

      // We fetch stuff if we don't have it already
      // and a request for it is not in progress or ended with an error.

      var id = match.params.id;
      if (fullEvent && fullEvent.id === id && Array.isArray(fullEvent.cuIDs)) {
        fullEvent.cuIDs.forEach(function (cuID) {
          var cu = fullEvent.content_units.find(function (x) {
            return x.id === cuID;
          });
          if (!cu || !cu.files) {
            if (!(wip.items[cuID] || errors.items[cuID])) {
              fetchEventItem(cuID);
            }
          }
        });
      } else if (!(wip.fulls[id] || errors.fulls[id])) {
        fetchFullEvent(id);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullEventContainer, [{
    key: 'componentDidMount',


    // TODO: Following 3 methods are copy/paste from full lesson. Consider reuse by some HOC.
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
          match = _props.match,
          language = _props.language,
          fullEvent = _props.fullEvent,
          wipMap = _props.wip,
          errors = _props.errors;

      // We're wip / err if some request is wip / err

      var id = match.params.id;
      var wip = wipMap.fulls[id];
      var err = errors.fulls[id];
      if (fullEvent) {
        wip = wip || Array.isArray(fullEvent.cuIDs) && fullEvent.cuIDs.some(function (cuID) {
          return wipMap.items[cuID];
        });
        if (!err) {
          var cuIDwithError = Array.isArray(fullEvent.cuIDs) && fullEvent.cuIDs.find(function (cuID) {
            return errors.items[cuID];
          });
          err = cuIDwithError ? errors.items[cuIDwithError] : null;
        }
      }

      return _react2.default.createElement(_FullEvent2.default, { fullEvent: fullEvent, wip: wip, err: err, language: language });
    }
  }]);

  return FullEventContainer;
}(_react.Component);

FullEventContainer.propTypes = {
  match: shapes.RouterMatch.isRequired,
  language: _propTypes2.default.string.isRequired,
  fullEvent: shapes.EventCollection,
  wip: shapes.WipMap,
  errors: shapes.ErrorsMap,
  fetchFullEvent: _propTypes2.default.func.isRequired,
  fetchEventItem: _propTypes2.default.func.isRequired
};
FullEventContainer.defaultProps = {
  fullEvent: null,
  // Fix: chapters to units and parts to units everywhere!!!
  wip: { fulls: {}, items: {} },
  errors: { fulls: {}, items: {} }
};


function mapState(state, props) {
  var fullEvent = _mdb.selectors.getDenormCollectionWUnits(state.mdb, props.match.params.id);

  return {
    fullEvent: fullEvent,
    wip: _events.selectors.getWip(state.events),
    errors: _events.selectors.getErrors(state.events),
    language: _settings.selectors.getLanguage(state.settings)
  };
}

function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchFullEvent: _events.actions.fetchFullEvent,
    fetchEventItem: _events.actions.fetchEventItem
  }, dispatch);
}

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(FullEventContainer);