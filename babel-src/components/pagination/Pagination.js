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

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../helpers/consts');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * # Stateless Pager component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ## Usage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * <Pager pageNo={3}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *        total={20}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *        pageSize={5}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *        titles={{
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            first:   "First",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            prev:    "Prev",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            prevSet: "<<<",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            nextSet: ">>>",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            next:    "Next",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *            last:    "Last"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *        }} />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ## How it looks like
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * First | Prev | ... | 6 | 7 | 8 | 9 | ... | Next | Last
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Pagination = function (_PureComponent) {
  _inherits(Pagination, _PureComponent);

  function Pagination() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Pagination);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call.apply(_ref, [this].concat(args))), _this), _this.getTitle = function (key) {
      return _this.props.titles[key] || Pagination.TITLES[key];
    }, _this.renderPage = function (content, value, key, disabled) {
      var active = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      if (disabled) {
        return _react2.default.createElement(
          _semanticUiReact.Menu.Item,
          { disabled: true },
          content
        );
      }

      return _react2.default.createElement(_semanticUiReact.Menu.Item, {
        key: key,
        active: active,
        content: content,
        onClick: function onClick() {
          return _this.props.onChange(value);
        }
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /** Calculates "blocks" of buttons with page numbers. */


  _createClass(Pagination, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          total = _props.total,
          pageSize = _props.pageSize,
          pageNo = _props.pageNo,
          windowSize = _props.windowSize,
          language = _props.language;

      var _Pagination$calcBlock = Pagination.calcBlocks({ total: total, pageSize: pageSize, pageNo: pageNo }),
          current = _Pagination$calcBlock.current,
          totalBlocks = _Pagination$calcBlock.totalBlocks;

      var visibleRange = Pagination.visibleRange(current, totalBlocks, windowSize);
      if (visibleRange.length === 0) {
        return null;
      }

      var isRTL = _consts.RTL_LANGUAGES.includes(language);

      var titles = this.getTitle;
      var prevDisabled = current === 1;
      var nextDisabled = current === totalBlocks;
      var hidePrevSet = visibleRange[0] === 1;
      var hideNextSet = visibleRange[visibleRange.length - 1] === totalBlocks;

      return _react2.default.createElement(
        _semanticUiReact.Menu,
        { compact: true, color: 'blue' },
        this.renderPage(titles(isRTL ? 'last' : 'first'), 1, 'first', prevDisabled),
        this.renderPage(titles(isRTL ? 'next' : 'prev'), current - 1, 'prev', prevDisabled),
        hidePrevSet ? null : this.renderPage(titles(isRTL ? 'nextSet' : 'prevSet'), -100, 'prevSet', true),
        visibleRange.map(function (x) {
          return _this2.renderPage(x, x, x, false, x === current);
        }),
        hideNextSet ? null : this.renderPage(titles(isRTL ? 'prevSet' : 'nextSet'), -101, 'nextSet', true),
        this.renderPage(titles(isRTL ? 'prev' : 'next'), current + 1, 'next', nextDisabled),
        this.renderPage(titles(isRTL ? 'first' : 'last'), totalBlocks, 'last', nextDisabled)
      );
    }
  }]);

  return Pagination;
}(_react.PureComponent);

Pagination.TITLES = {
  first: _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle double left' }),
  prev: _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle left' }),
  prevSet: _react2.default.createElement(_semanticUiReact.Icon, { name: 'ellipsis horizontal' }),
  nextSet: _react2.default.createElement(_semanticUiReact.Icon, { name: 'ellipsis horizontal' }),
  next: _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle right' }),
  last: _react2.default.createElement(_semanticUiReact.Icon, { name: 'angle double right' })
};
Pagination.propTypes = {
  pageSize: _propTypes2.default.number.isRequired,
  total: _propTypes2.default.number,
  pageNo: _propTypes2.default.number,
  language: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  windowSize: _propTypes2.default.number,
  titles: _propTypes2.default.shape({
    first: _propTypes2.default.node,
    prev: _propTypes2.default.node,
    prevSet: _propTypes2.default.node,
    nextSet: _propTypes2.default.node,
    next: _propTypes2.default.node,
    last: _propTypes2.default.node
  })
};
Pagination.defaultProps = {
  pageNo: 1,
  total: 0,
  language: _consts.DEFAULT_LANGUAGE,
  onChange: _noop2.default,
  windowSize: 3,
  titles: Pagination.TITLES
};

Pagination.calcBlocks = function (_ref2) {
  var total = _ref2.total,
      pageSize = _ref2.pageSize,
      pageNo = _ref2.pageNo;

  var current = pageNo === 0 ? 1 : pageNo;
  var totalBlocks = Math.ceil(total / pageSize);
  return { current: current, totalBlocks: totalBlocks };
};

Pagination.visibleRange = function (current, total, windowSize) {
  var start = Math.max(1, current - windowSize);
  var end = Math.min(current + windowSize, total);

  if (end <= start) {
    return [];
  }

  return Array.from(new Array(end - start + 1), function (val, index) {
    return start + index;
  });
};

exports.default = Pagination;