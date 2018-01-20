'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('moment-duration-format');

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../helpers/utils');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../../shared/Splash');

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _Pagination = require('../../pagination/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _ResultsPageHeader = require('../../pagination/ResultsPageHeader');

var _ResultsPageHeader2 = _interopRequireDefault(_ResultsPageHeader);

var _PageHeader = require('./PageHeader');

var _PageHeader2 = _interopRequireDefault(_PageHeader);

var _Filters = require('./Filters');

var _Filters2 = _interopRequireDefault(_Filters);

var _ChaptersList = require('./ChaptersList');

var _ChaptersList2 = _interopRequireDefault(_ChaptersList);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullProgram = function (_Component) {
  _inherits(FullProgram, _Component);

  function FullProgram() {
    _classCallCheck(this, FullProgram);

    return _possibleConstructorReturn(this, (FullProgram.__proto__ || Object.getPrototypeOf(FullProgram)).apply(this, arguments));
  }

  _createClass(FullProgram, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          fullProgram = _props.fullProgram,
          wip = _props.wip,
          err = _props.err,
          items = _props.items,
          itemsWip = _props.itemsWip,
          itemsErr = _props.itemsErr,
          pageNo = _props.pageNo,
          total = _props.total,
          pageSize = _props.pageSize,
          language = _props.language,
          t = _props.t,
          onPageChange = _props.onPageChange,
          onFiltersChanged = _props.onFiltersChanged,
          onFiltersHydrated = _props.onFiltersHydrated;


      if (err) {
        if (err.response && err.response.status === 404) {
          return _react2.default.createElement(_Splash.FrownSplash, {
            text: t('messages.program-not-found'),
            subtext: _react2.default.createElement(
              _reactI18next.Trans,
              { i18nKey: 'messages.program-not-found-subtext' },
              'Try the ',
              _react2.default.createElement(
                _MultiLanguageLink2.default,
                { to: '/programs' },
                'programs list'
              ),
              '...'
            )
          });
        }

        return _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
      }

      if (wip) {
        return _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      }

      var listContent = void 0;
      if (itemsErr) {
        listContent = _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
      } else if (itemsWip) {
        listContent = _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      } else {
        listContent = _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded' },
          _react2.default.createElement(_ResultsPageHeader2.default, { pageNo: pageNo, total: total, pageSize: pageSize, t: t }),
          _react2.default.createElement(_ChaptersList2.default, { items: items })
        );
      }

      if (!fullProgram) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_PageHeader2.default, { fullProgram: fullProgram, wip: wip, err: err }),
        _react2.default.createElement(_Filters2.default, { onChange: onFiltersChanged, onHydrated: onFiltersHydrated }),
        listContent,
        _react2.default.createElement(_semanticUiReact.Divider, { fitted: true }),
        _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded', textAlign: 'center' },
          _react2.default.createElement(_Pagination2.default, {
            pageNo: pageNo,
            pageSize: pageSize,
            total: total,
            language: language,
            onChange: onPageChange
          })
        )
      );
    }
  }]);

  return FullProgram;
}(_react.Component);

FullProgram.propTypes = {
  fullProgram: shapes.ProgramCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  items: _propTypes2.default.arrayOf(shapes.ProgramChapter),
  itemsWip: _propTypes2.default.bool,
  itemsErr: shapes.Error,
  pageNo: _propTypes2.default.number.isRequired,
  total: _propTypes2.default.number.isRequired,
  pageSize: _propTypes2.default.number.isRequired,
  language: _propTypes2.default.string.isRequired,
  t: _propTypes2.default.func.isRequired,
  onPageChange: _propTypes2.default.func.isRequired,
  onFiltersChanged: _propTypes2.default.func.isRequired,
  onFiltersHydrated: _propTypes2.default.func.isRequired
};
FullProgram.defaultProps = {
  fullProgram: null,
  wip: false,
  err: null,
  items: [],
  itemsWip: false,
  itemsErr: null
};
exports.default = (0, _reactI18next.translate)()(FullProgram);