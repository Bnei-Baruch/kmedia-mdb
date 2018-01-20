'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _lessons = require('../../../redux/modules/lessons');

var _settings = require('../../../redux/modules/settings');

var _mdb = require('../../../redux/modules/mdb');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _LessonPart = require('./LessonPart');

var _LessonPart2 = _interopRequireDefault(_LessonPart);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LessonPartContainer = function (_Component) {
  _inherits(LessonPartContainer, _Component);

  function LessonPartContainer() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, LessonPartContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LessonPartContainer.__proto__ || Object.getPrototypeOf(LessonPartContainer)).call.apply(_ref, [this].concat(args))), _this), _this.askForDataIfNeeded = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(props) {
        var match, lesson, wip, err, fetchLessonPart, id;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                match = props.match, lesson = props.lesson, wip = props.wip, err = props.err, fetchLessonPart = props.fetchLessonPart;

                // We fetch stuff if we don't have it already
                // and a request for it is not in progress or ended with an error.

                if (!(wip || err)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return');

              case 3:
                id = match.params.id;

                if (!(lesson && lesson.id === id && Array.isArray(lesson.files))) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return');

              case 6:
                _context.next = 8;
                return fetchLessonPart(id);

              case 8:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LessonPartContainer, [{
    key: 'componentWillMount',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.askForDataIfNeeded(this.props);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentWillMount() {
        return _ref3.apply(this, arguments);
      }

      return componentWillMount;
    }()
  }, {
    key: 'componentDidMount',
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
          language = _props.language,
          lesson = _props.lesson,
          wip = _props.wip,
          err = _props.err;

      return _react2.default.createElement(_LessonPart2.default, {
        lesson: wip || err ? null : lesson,
        language: language,
        wip: wip,
        err: err
      });
    }
  }]);

  return LessonPartContainer;
}(_react.Component);

LessonPartContainer.propTypes = {
  match: shapes.RouterMatch.isRequired,
  language: _propTypes2.default.string.isRequired,
  lesson: shapes.LessonPart,
  wip: shapes.WIP,
  err: shapes.Error,
  fetchLessonPart: _propTypes2.default.func.isRequired
};
LessonPartContainer.defaultProps = {
  lesson: null,
  wip: false,
  err: null
};
exports.default = (0, _reactRedux.connect)(function (state, ownProps) {
  var id = ownProps.match.params.id;
  return {
    lesson: _mdb.selectors.getDenormContentUnit(state.mdb, id),
    wip: _lessons.selectors.getWip(state.lessons).parts[id],
    err: _lessons.selectors.getErrors(state.lessons).parts[id],
    language: _settings.selectors.getLanguage(state.settings)
  };
}, function (dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchLessonPart: _lessons.actions.fetchLessonPart
  }, dispatch);
})(LessonPartContainer);