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

var ChaptersList = function (_PureComponent) {
  _inherits(ChaptersList, _PureComponent);

  function ChaptersList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ChaptersList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ChaptersList.__proto__ || Object.getPrototypeOf(ChaptersList)).call.apply(_ref, [this].concat(args))), _this), _this.renderChapter = function (unit) {
      var breakdown = new _mdb.CollectionsBreakdown(Object.values(unit.collections || {}));

      var relatedItems = breakdown.getPrograms().map(function (x) {
        return _react2.default.createElement(
          _semanticUiReact.List.Item,
          { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
          x.name || '☠ no name'
        );
      }).concat(breakdown.getAllButPrograms().map(function (x) {
        return _react2.default.createElement(
          _semanticUiReact.List.Item,
          { key: x.id, as: _MultiLanguageLink2.default, to: (0, _utils.canonicalLink)(x) },
          x.name
        );
      }));

      var t = _this.props.t;

      var filmDate = '';
      if (unit.film_date) {
        filmDate = t('values.date', { date: new Date(unit.film_date) });
      }

      return _react2.default.createElement(
        _semanticUiReact.Table.Row,
        { key: unit.id, verticalAlign: 'top' },
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, singleLine: true, width: 1 },
          _react2.default.createElement(
            'strong',
            null,
            filmDate
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          { collapsing: true, width: 1 },
          _react2.default.createElement(_semanticUiReact.Image, { fluid: true, src: 'http://www.kab.co.il/images/attachments/91/276191_medium.jpg' })
        ),
        _react2.default.createElement(
          _semanticUiReact.Table.Cell,
          null,
          _react2.default.createElement(
            _MultiLanguageLink2.default,
            { to: (0, _utils.canonicalLink)(unit) },
            _react2.default.createElement(
              'strong',
              null,
              unit.name || '☠ no name'
            )
          ),
          _react2.default.createElement(
            _semanticUiReact.List,
            { horizontal: true, link: true, size: 'tiny' },
            _react2.default.createElement(
              _semanticUiReact.List.Item,
              null,
              _react2.default.createElement(
                _semanticUiReact.List.Header,
                null,
                t('programs.list.episode_from')
              )
            ),
            relatedItems
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ChaptersList, [{
    key: 'render',
    value: function render() {
      var items = this.props.items;


      if (!Array.isArray(items) || items.length === 0) {
        return _react2.default.createElement(_semanticUiReact.Grid, { columns: 2, celled: 'internally' });
      }

      return _react2.default.createElement(
        _semanticUiReact.Table,
        { sortable: true, basic: 'very', className: 'index-list' },
        _react2.default.createElement(
          _semanticUiReact.Table.Body,
          null,
          items.map(this.renderChapter)
        )
      );
    }
  }]);

  return ChaptersList;
}(_react.PureComponent);

ChaptersList.propTypes = {
  items: _propTypes2.default.arrayOf(shapes.ProgramChapter),
  t: _propTypes2.default.func.isRequired
};
ChaptersList.defaultProps = {
  items: []
};
exports.default = (0, _reactI18next.translate)()(ChaptersList);