'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _lessons = require('../../../redux/modules/lessons');

var _mdb = require('../../../redux/modules/mdb');

var _settings = require('../../../redux/modules/settings');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _FullLesson = require('./FullLesson');

var _FullLesson2 = _interopRequireDefault(_FullLesson);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FullLessonContainer = function (_Component) {
  _inherits(FullLessonContainer, _Component);

  function FullLessonContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FullLessonContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FullLessonContainer.__proto__ || Object.getPrototypeOf(FullLessonContainer)).call.apply(_ref, [this].concat(args))), _this), _this.askForDataIfNeeded = function (props) {
      var match = props.match,
          fullLesson = props.fullLesson,
          wip = props.wip,
          errors = props.errors,
          fetchFullLesson = props.fetchFullLesson,
          fetchLessonPart = props.fetchLessonPart;

      // We fetch stuff if we don't have it already
      // and a request for it is not in progress or ended with an error.

      var id = match.params.id;
      if (fullLesson && fullLesson.id === id) {
        fullLesson.cuIDs.forEach(function (cuID) {
          var cu = fullLesson.content_units.find(function (x) {
            return x.id === cuID;
          });
          if (!cu || !cu.files) {
            if (!(wip.parts[cuID] || errors.parts[cuID])) {
              fetchLessonPart(cuID);
            }
          }
        });
      } else if (!(wip.fulls[id] || errors.fulls[id])) {
        fetchFullLesson(id);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FullLessonContainer, [{
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
          match = _props.match,
          language = _props.language,
          fullLesson = _props.fullLesson,
          wipMap = _props.wip,
          errors = _props.errors;

      // We're wip / err if some request is wip / err

      var id = match.params.id;
      var wip = wipMap.fulls[id];
      var err = errors.fulls[id];
      if (fullLesson) {
        wip = wip || fullLesson.cuIDs.some(function (cuID) {
          return wipMap.parts[cuID];
        });
        if (!err) {
          var cuIDwithError = fullLesson.cuIDs.find(function (cuID) {
            return errors.parts[cuID];
          });
          err = cuIDwithError ? errors.parts[cuIDwithError] : null;
        }
      }

      return _react2.default.createElement(_FullLesson2.default, { fullLesson: fullLesson, wip: wip, err: err, language: language });
    }
  }]);

  return FullLessonContainer;
}(_react.Component);

FullLessonContainer.propTypes = {
  match: shapes.RouterMatch.isRequired,
  language: _propTypes2.default.string.isRequired,
  fullLesson: shapes.LessonCollection,
  wip: shapes.WipMap,
  errors: shapes.ErrorsMap,
  fetchFullLesson: _propTypes2.default.func.isRequired,
  fetchLessonPart: _propTypes2.default.func.isRequired
};
FullLessonContainer.defaultProps = {
  fullLesson: null,
  wip: { fulls: {}, parts: {} },
  errors: { fulls: {}, parts: {} }
};


function mapState(state, props) {
  var fullLesson = _mdb.selectors.getDenormCollectionWUnits(state.mdb, props.match.params.id);

  return {
    fullLesson: fullLesson,
    wip: _lessons.selectors.getWip(state.lessons),
    errors: _lessons.selectors.getErrors(state.lessons),
    language: _settings.selectors.getLanguage(state.settings)
  };
}

function mapDispatch(dispatch) {
  return (0, _redux.bindActionCreators)({
    fetchFullLesson: _lessons.actions.fetchFullLesson,
    fetchLessonPart: _lessons.actions.fetchLessonPart
  }, dispatch);
}

exports.default = (0, _reactRedux.connect)(mapState, mapDispatch)(FullLessonContainer);