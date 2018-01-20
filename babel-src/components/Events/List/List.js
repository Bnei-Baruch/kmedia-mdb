'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../helpers/consts');

var _utils = require('../../../helpers/utils');

var _date = require('../../../helpers/date');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventsList = function (_PureComponent) {
  _inherits(EventsList, _PureComponent);

  function EventsList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, EventsList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EventsList.__proto__ || Object.getPrototypeOf(EventsList)).call.apply(_ref, [this].concat(args))), _this), _this.renderCollection = function (collection) {
      var localDate = (0, _date.fromToLocalized)(_moment2.default.utc(collection.start_date, _consts.DATE_FORMAT), _moment2.default.utc(collection.end_date, _consts.DATE_FORMAT));

      return _react2.default.createElement(
        _semanticUiReact.Table.Row,
        { verticalAlign: 'top', key: collection.id },
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, singleLine: true, width: 1 },
          _react2.default.createElement(
            'strong',
            null,
            localDate
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          null,
          _react2.default.createElement(
            _MultiLanguageLink2.default,
            { to: (0, _utils.canonicalLink)(collection) },
            _react2.default.createElement(
              'strong',
              null,
              collection.name || '⛔ NO NAME'
            )
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(EventsList, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          items = _props.items,
          t = _props.t;


      if (!Array.isArray(items) || items.length === 0) {
        return _react2.default.createElement(
          'div',
          null,
          t('events.no-matches')
        );
      }

      return _react2.default.createElement(
        _semanticUiReact.Table,
        { basic: 'very', sortable: true },
        _react2.default.createElement(
          _semanticUiReact.Table.Body,
          null,
          items.map(this.renderCollection)
        )
      );
    }
  }]);

  return EventsList;
}(_react.PureComponent);

EventsList.propTypes = {
  items: _propTypes2.default.arrayOf(shapes.EventCollection),
  t: _propTypes2.default.func.isRequired
};
EventsList.defaultProps = {
  items: []
};
exports.default = EventsList;