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

var _connectFilter = require('../connectFilter');

var _connectFilter2 = _interopRequireDefault(_connectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeepListFilter = function (_React$Component) {
  _inherits(DeepListFilter, _React$Component);

  function DeepListFilter() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DeepListFilter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DeepListFilter.__proto__ || Object.getPrototypeOf(DeepListFilter)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selection: _this.props.value
    }, _this.menus = {}, _this.onSelectionChange = function (event, data) {
      var value = data.value;

      var depth = data['data-depth'];

      var oldSelection = _this.state.selection;

      var newSelection = [].concat(_toConsumableArray(oldSelection));
      newSelection.splice(depth, oldSelection.length - depth);
      newSelection.push(value);

      var menu = _this.menus[depth];
      var prevScrollTop = menu.scrollTop;
      _this.setState({ selection: newSelection }, function () {
        _this.menus[depth].scrollTop = prevScrollTop;
      });
    }, _this.onCancel = function () {
      _this.props.onCancel();
    }, _this.apply = function () {
      var selection = _this.state.selection;
      if (Array.isArray(selection) && selection.length === 0) {
        return;
      }
      _this.props.updateValue(selection);
      _this.props.onApply();
    }, _this.canApply = function () {
      return _this.state.selection && _this.state.selection.length > 0;
    }, _this.scrollToSelections = function (selections) {
      selections.forEach(function (selection, depth) {
        var selectedItems = _this.menus[depth].getElementsByClassName('active');

        if (selectedItems.length) {
          var firstItem = selectedItems[0];
          _this.menus[depth].scrollTop = firstItem.offsetTop;
        }
      });
    }, _this.createLists = function (depth, items, selection, otherSelected) {
      if (!Array.isArray(items) || items.length === 0) {
        return [];
      }

      if (selection.length === 0) {
        return [_this.createList(depth, items, '', otherSelected.map(function (s) {
          return s[0];
        }))];
      }

      var selected = _this.props.getSubItemById(selection[0]);
      var current = _this.createList(depth, items, selection[0], otherSelected.map(function (s) {
        return s[0];
      }));
      var next = [];
      if (selected && selected.children) {
        next = _this.createLists(depth + 1, selected.children, selection.slice(1), otherSelected.filter(function (s) {
          return s.length > 0;
        }).map(function (s) {
          return s.slice(1);
        }));
      }

      return [current].concat(next);
    }, _this.createList = function (depth, items, selectedId, otherSelectedIds) {
      var getSubItemById = _this.props.getSubItemById;


      return _react2.default.createElement(
        'div',
        { key: selectedId, className: 'filter-steps__column-wrapper', ref: function ref(el) {
            return _this.menus[depth] = el;
          } },
        _react2.default.createElement(
          'div',
          { className: 'filter-steps__column' },
          _react2.default.createElement(
            _semanticUiReact.Menu,
            { fluid: true, vertical: true, color: 'blue', size: 'tiny' },
            items.map(function (x) {
              var node = getSubItemById(x);
              var style = otherSelectedIds.includes(x) && selectedId !== x ? { backgroundColor: 'lightgoldenrodyellow' } : {};

              return _react2.default.createElement(
                _semanticUiReact.Menu.Item,
                {
                  key: x,
                  value: x,
                  active: selectedId === x,
                  'data-depth': depth,
                  onClick: _this.onSelectionChange,
                  style: style
                },
                node.name
              );
            })
          )
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DeepListFilter, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scrollToSelections(this.state.selection);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        selection: nextProps.value
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.listContainer.scrollLeft = this.listContainer.scrollWidth;
      this.scrollToSelections(this.state.selection);
    }

    // Return all lists of selected sources.

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          roots = _props.roots,
          t = _props.t,
          emptyLabel = _props.emptyLabel;


      return _react2.default.createElement(
        _semanticUiReact.Container,
        { className: 'padded-horizontally' },
        _react2.default.createElement(
          _semanticUiReact.Segment,
          {
            vertical: true,
            className: 'tab active',
            style: { padding: '0' }
          },
          _react2.default.createElement(
            'div',
            {
              className: 'filter-steps'
              // eslint-disable-next-line no-return-assign
              , ref: function ref(el) {
                return _this2.listContainer = el;
              }
            },
            roots.length > 0 ? this.createLists(0, roots, this.state.selection, this.props.allValues) : { emptyLabel: emptyLabel }
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Segment,
          { vertical: true, clearing: true },
          _react2.default.createElement(_semanticUiReact.Button, { primary: true, content: t('buttons.apply'), floated: 'right', disabled: !this.canApply(), onClick: this.apply }),
          _react2.default.createElement(_semanticUiReact.Button, { content: t('buttons.close'), floated: 'right', onClick: this.onCancel })
        )
      );
    }
  }]);

  return DeepListFilter;
}(_react2.default.Component);

DeepListFilter.propTypes = {
  roots: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  getSubItemById: _propTypes2.default.func.isRequired,
  onCancel: _propTypes2.default.func,
  onApply: _propTypes2.default.func,
  emptyLabel: _propTypes2.default.string.isRequired,
  updateValue: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.arrayOf(_propTypes2.default.string),
  allValues: _propTypes2.default.arrayOf(_propTypes2.default.arrayOf(_propTypes2.default.string))
};
DeepListFilter.defaultProps = {
  roots: [],
  onCancel: _noop2.default,
  onApply: _noop2.default,
  value: [],
  allValues: []
};
exports.default = (0, _connectFilter2.default)()(DeepListFilter);