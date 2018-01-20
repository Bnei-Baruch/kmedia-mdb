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

var _utils = require('../../../helpers/utils');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../../shared/Splash');

var _SectionHeader = require('../../shared/SectionHeader');

var _SectionHeader2 = _interopRequireDefault(_SectionHeader);

var _ResultsPageHeader = require('../../pagination/ResultsPageHeader');

var _ResultsPageHeader2 = _interopRequireDefault(_ResultsPageHeader);

var _Filters = require('./Filters');

var _Filters2 = _interopRequireDefault(_Filters);

var _List = require('./List');

var _List2 = _interopRequireDefault(_List);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventsPage = function (_PureComponent) {
  _inherits(EventsPage, _PureComponent);

  function EventsPage() {
    _classCallCheck(this, EventsPage);

    return _possibleConstructorReturn(this, (EventsPage.__proto__ || Object.getPrototypeOf(EventsPage)).apply(this, arguments));
  }

  _createClass(EventsPage, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          items = _props.items,
          wip = _props.wip,
          err = _props.err,
          t = _props.t;


      var content = void 0;
      if (err) {
        content = _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
      } else if (wip) {
        content = _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      } else {
        content = _react2.default.createElement(
          _semanticUiReact.Container,
          { className: 'padded' },
          _react2.default.createElement(_ResultsPageHeader2.default, { pageNo: 1, pageSize: 1000, total: items.length }),
          _react2.default.createElement(_semanticUiReact.Divider, { fitted: true }),
          _react2.default.createElement(_List2.default, { items: items, t: t })
        );
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_SectionHeader2.default, { section: 'events' }),
        _react2.default.createElement(_semanticUiReact.Divider, { fitted: true }),
        _react2.default.createElement(_Filters2.default, null),
        content
      );
    }
  }]);

  return EventsPage;
}(_react.PureComponent);

EventsPage.propTypes = {
  items: _propTypes2.default.arrayOf(shapes.EventCollection),
  wip: shapes.WIP,
  err: shapes.Error,
  t: _propTypes2.default.func.isRequired
};
EventsPage.defaultProps = {
  items: [],
  wip: false,
  err: null
};
exports.default = (0, _reactI18next.translate)()(EventsPage);