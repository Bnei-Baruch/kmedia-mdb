'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../helpers/consts');

var _mdb = require('../../../helpers/mdb');

var _utils = require('../../../helpers/utils');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LessonsList = function (_PureComponent) {
  _inherits(LessonsList, _PureComponent);

  function LessonsList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LessonsList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LessonsList.__proto__ || Object.getPrototypeOf(LessonsList)).call.apply(_ref, [this].concat(args))), _this), _this.renderPart = function (part, t) {
      var breakdown = new _mdb.CollectionsBreakdown(Object.values(part.collections || {}));

      var relatedItems = breakdown.getDailyLessons().map(function (x) {
        return _react2.default.createElement(
          _semanticUiReact.List.Item,
          { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
          t('constants.content-types.' + x.content_type),
          ' ',
          t('values.date', { date: new Date(x.film_date) })
        );
      }).concat(breakdown.getAllButDailyLessons().map(function (x) {
        return _react2.default.createElement(
          _semanticUiReact.List.Item,
          { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
          x.name
        );
      }));

      return _react2.default.createElement(
        _semanticUiReact.Table.Row,
        { verticalAlign: 'top', key: part.id },
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, singleLine: true, width: 1 },
          _react2.default.createElement(
            'strong',
            null,
            t('values.date', { date: new Date(part.film_date) })
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          null,
          _react2.default.createElement(
            _MultiLanguageLink2.default,
            { to: (0, _utils.canonicalLink)(part) },
            _react2.default.createElement(
              'strong',
              null,
              part.name
            )
          ),
          relatedItems.length === 0 ? null : _react2.default.createElement(
            _semanticUiReact.List,
            { size: 'tiny', divided: true, horizontal: true, link: true },
            _react2.default.createElement(
              _semanticUiReact.List.Item,
              null,
              _react2.default.createElement(
                _semanticUiReact.List.Header,
                null,
                t('lessons.list.related'),
                ':'
              )
            ),
            relatedItems
          )
        )
      );
    }, _this.renderCollection = function (collection, t) {
      var units = [];
      if (collection.content_units) {
        units = collection.content_units.map(function (unit) {
          var breakdown = new _mdb.CollectionsBreakdown(Object.values(unit.collections || {}));

          var relatedItems = breakdown.getDailyLessons().filter(function (x) {
            return x.id !== collection.id;
          }).map(function (x) {
            return _react2.default.createElement(
              _semanticUiReact.List.Item,
              { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
              t('constants.content-types.' + x.content_type),
              ' ',
              t('values.date', { date: new Date(x.film_date) })
            );
          }).concat(breakdown.getAllButDailyLessons().map(function (x) {
            return _react2.default.createElement(
              _semanticUiReact.List.Item,
              { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
              x.name
            );
          }));

          return _react2.default.createElement(
            _semanticUiReact.Table.Row,
            { verticalAlign: 'top', key: 'u-' + unit.id },
            _react2.default.createElement(
              _semanticUiReact.Table.Cell,
              null,
              _react2.default.createElement(
                _MultiLanguageLink2.default,
                { to: (0, _utils.canonicalLink)(unit) },
                unit.name
              ),
              relatedItems.length === 0 ? null : _react2.default.createElement(
                _semanticUiReact.List,
                { size: 'tiny', divided: true, horizontal: true, link: true },
                _react2.default.createElement(
                  _semanticUiReact.List.Item,
                  null,
                  _react2.default.createElement(
                    _semanticUiReact.List.Header,
                    null,
                    t('lessons.list.related'),
                    ':'
                  )
                ),
                relatedItems
              )
            )
          );
        });
      }

      var rows = [];
      var contentUnitsSpan = collection.content_units ? collection.content_units.length + 1 : 1;

      rows.push(_react2.default.createElement(
        _semanticUiReact.Table.Row,
        { verticalAlign: 'top', key: 'l-' + collection.id },
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, singleLine: true, width: 1, rowSpan: contentUnitsSpan },
          _react2.default.createElement(
            'strong',
            null,
            t('values.date', { date: new Date(collection.film_date) })
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
              t('constants.content-types.' + collection.content_type)
            )
          )
        )
      ));
      return rows.concat(units);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LessonsList, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          items = _props.items,
          t = _props.t;


      if (!items) {
        return _react2.default.createElement(_semanticUiReact.Grid, { columns: 2, celled: 'internally' });
      }

      return _react2.default.createElement(
        _semanticUiReact.Table,
        { basic: 'very', sortable: true, className: 'index-list' },
        _react2.default.createElement(
          _semanticUiReact.Table.Body,
          null,
          items.map(function (x) {
            return x.content_type === _consts.CT_LESSON_PART ? _this2.renderPart(x, t) : _this2.renderCollection(x, t);
          })
        )
      );
    }
  }]);

  return LessonsList;
}(_react.PureComponent);

LessonsList.propTypes = {
  items: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
  t: _propTypes2.default.func.isRequired
};
LessonsList.defaultProps = {
  items: []
};
exports.default = (0, _reactI18next.translate)()(LessonsList);