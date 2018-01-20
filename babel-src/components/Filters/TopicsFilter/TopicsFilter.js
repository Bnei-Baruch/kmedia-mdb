'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiTopicsFilter = exports.TopicsFilter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../helpers/consts');

var _tags = require('../../../redux/modules/tags');

var _connectFilter = require('../connectFilter');

var _connectFilter2 = _interopRequireDefault(_connectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopicsFilterBase = function (_React$Component) {
  _inherits(TopicsFilterBase, _React$Component);

  function TopicsFilterBase() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TopicsFilterBase);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TopicsFilterBase.__proto__ || Object.getPrototypeOf(TopicsFilterBase)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selection: _this.props.value
    }, _this.onSelectionChange = function (event, data) {
      var value = data.value;

      _this.setState({ selection: value });
    }, _this.onCancel = function () {
      _this.props.onCancel();
    }, _this.apply = function () {
      var selection = _this.state.selection;
      if (selection === null) {
        return;
      }
      _this.props.updateValue(selection);
      _this.props.onApply();
    }, _this.canApply = function () {
      return _this.state.selection && _this.state.selection.length > 0;
    }, _this.createList = function (items, selected) {
      if (!Array.isArray(items)) {
        return null;
      }

      var getTagById = _this.props.getTagById;

      return _react2.default.createElement(
        'div',
        {
          style: {
            height: '250px',
            overflowY: 'scroll'
          }
        },
        _react2.default.createElement(
          _semanticUiReact.List,
          { divided: true, relaxed: true, selection: true },
          items.map(function (x) {
            var node = getTagById(x);
            var style = _this.props.allValues.includes(x) && selected !== x ? { backgroundColor: 'lightgoldenrodyellow' } : {};

            return _react2.default.createElement(
              _semanticUiReact.List.Item,
              {
                key: node.id,
                value: node.id,
                style: style,
                active: selected === node.id,
                onClick: _this.onSelectionChange
              },
              node.label
            );
          })
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TopicsFilterBase, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        selection: nextProps.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          t = _props.t,
          getTagById = _props.getTagById,
          namespace = _props.namespace;

      var topics = void 0;

      switch (namespace) {
        // TODO: Search should have both lessons and programs topics.
        // The UI should should another layer (similar to sources).
        case 'search':
          topics = getTagById(_consts.TAG_LESSONS_TOPICS);
          break;
        case 'lessons':
          topics = getTagById(_consts.TAG_LESSONS_TOPICS);
          break;
        case 'programs':
        case 'full-program':
          topics = getTagById(_consts.TAG_PROGRAMS_TOPICS);
          break;
        default:
          topics = '';
      }

      return _react2.default.createElement(
        _semanticUiReact.Segment,
        { basic: true, clearing: true, attached: 'bottom', className: 'tab active' },
        topics.children ? this.createList(topics.children, this.state.selection) : 'No topics',
        _react2.default.createElement(_semanticUiReact.Divider, null),
        _react2.default.createElement(
          _semanticUiReact.Segment,
          { vertical: true, clearing: true },
          _react2.default.createElement(_semanticUiReact.Button, { primary: true, content: t('buttons.apply'), floated: 'right', disabled: !this.canApply(), onClick: this.apply }),
          _react2.default.createElement(_semanticUiReact.Button, { content: t('buttons.cancel'), floated: 'right', onClick: this.onCancel })
        )
      );
    }
  }]);

  return TopicsFilterBase;
}(_react2.default.Component);

TopicsFilterBase.propTypes = {
  onCancel: _propTypes2.default.func,
  onApply: _propTypes2.default.func,
  updateValue: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.string,
  getTagById: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  allValues: _propTypes2.default.arrayOf(_propTypes2.default.string),
  namespace: _propTypes2.default.string.isRequired
};
TopicsFilterBase.defaultProps = {
  onCancel: _noop2.default,
  onApply: _noop2.default,
  value: null,
  allValues: []
};


var TopicsFilter = (0, _reactRedux.connect)(function (state) {
  return {
    getTagById: _tags.selectors.getTagById(state.tags)
  };
})((0, _connectFilter2.default)()(TopicsFilterBase));

var MultiTopicsFilter = (0, _reactRedux.connect)(function (state) {
  return {
    getTagById: _tags.selectors.getTagById(state.tags)
  };
})((0, _connectFilter2.default)({ isMultiple: true })(TopicsFilterBase));

exports.TopicsFilter = TopicsFilter;
exports.MultiTopicsFilter = MultiTopicsFilter;