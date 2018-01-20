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

require('moment-duration-format');

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../helpers/consts');

var _date = require('../../../helpers/date');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _placeholder = require('./placeholder.png');

var _placeholder2 = _interopRequireDefault(_placeholder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullEventPlaylist = function (_Component) {
  _inherits(FullEventPlaylist, _Component);

  function FullEventPlaylist() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullEventPlaylist);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullEventPlaylist.__proto__ || Object.getPrototypeOf(FullEventPlaylist)).call.apply(_ref, [this].concat(args))), _this), _this.handleItemClick = function (e, data) {
      _this.props.onItemClick(e, data);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullEventPlaylist, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          collection = _props.collection,
          activePart = _props.activePart;
      var name = collection.name,
          start_date = collection.start_date,
          end_date = collection.end_date;


      var titles = collection.content_units.map(function (cu) {
        var name = cu.name,
            duration = cu.duration;

        var durationDisplay = _moment2.default.duration(duration, 'seconds').format('hh:mm:ss');
        return name + ' - ' + durationDisplay;
      });

      return _react2.default.createElement(
        'div',
        { className: 'avbox__playlist-wrapper' },
        _react2.default.createElement(
          _semanticUiReact.Header,
          { inverted: true, as: 'h1' },
          _react2.default.createElement(_semanticUiReact.Image, { shape: 'circular', src: _placeholder2.default }),
          _react2.default.createElement(
            _semanticUiReact.Header.Content,
            null,
            name,
            _react2.default.createElement(
              _semanticUiReact.Header.Subheader,
              null,
              (0, _date.fromToLocalized)(_moment2.default.utc(start_date, _consts.DATE_FORMAT), _moment2.default.utc(end_date, _consts.DATE_FORMAT))
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'avbox__playlist-view' },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { vertical: true, fluid: true, size: 'small' },
            collection.content_units.map(function (part, index) {
              return _react2.default.createElement(_semanticUiReact.Menu.Item, {
                key: part.id,
                name: '' + index,
                content: titles[index],
                active: index === activePart,
                onClick: _this2.handleItemClick
              });
            })
          )
        )
      );
    }
  }]);

  return FullEventPlaylist;
}(_react.Component);

FullEventPlaylist.propTypes = {
  collection: shapes.EventCollection.isRequired,
  activePart: _propTypes2.default.number,
  onItemClick: _propTypes2.default.func.isRequired
};
FullEventPlaylist.defaultProps = {
  activePart: 0
};
exports.default = FullEventPlaylist;