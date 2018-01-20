'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _noop = require('lodash/noop');

var _noop2 = _interopRequireDefault(_noop);

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../helpers/utils');

var _programs = require('../../../redux/modules/programs');

var _mdb = require('../../../redux/modules/mdb');

var _connectFilter = require('../connectFilter');

var _connectFilter2 = _interopRequireDefault(_connectFilter);

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProgramsFilter = function (_Component) {
  _inherits(ProgramsFilter, _Component);

  function ProgramsFilter() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ProgramsFilter);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ProgramsFilter.__proto__ || Object.getPrototypeOf(ProgramsFilter)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selection: _this.props.value
    }, _this.onSelectionGenreChange = function (event, data) {
      _this.setState({ selection: data.value });
    }, _this.onSelectionProgramChange = function (event, data) {
      _this.setState({
        selection: Object.assign({}, _this.state.selection, {
          program: data.value
        })
      });
    }, _this.onCancel = function () {
      _this.props.onCancel();
    }, _this.apply = function () {
      var selection = _this.state.selection;
      if (!(0, _utils.isEmpty)(selection)) {
        _this.props.updateValue(selection);
        _this.props.onApply();
      }
    }, _this.filterProgramsByGenre = function (genre, programs) {
      var filter = void 0;
      if ((0, _utils.isEmpty)(genre)) {
        filter = function filter(program) {
          return program;
        };
      } else {
        filter = function filter(program) {
          return Array.isArray(program.genres) && program.genres.includes(genre);
        };
      }

      var filteredProgram = programs.filter(filter).sort(function (a, b) {
        var nameA = a.name.charAt(0).toLowerCase();
        var nameB = b.name.charAt(0).toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      // Build tree of programs
      var key = 0;
      return filteredProgram.reduce(function (acc, program) {
        var firstLetter = program.name.charAt(0);
        if ([].concat(_toConsumableArray('0123456789')).includes(firstLetter)) {
          firstLetter = '#';
        }
        if (acc[firstLetter] === undefined) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push({ key: key, program: program });
        key++;
        return acc;
      }, []);
    }, _this.createList = function () {
      var _this$props = _this.props,
          programs = _this$props.programs,
          t = _this$props.t;

      var _ref2 = _this.state.selection || {},
          genre = _ref2.genre,
          program = _ref2.program;

      var filteredPrograms = _this.filterProgramsByGenre(genre, programs);
      var header = t('programs.genres.' + (genre || 'all'));

      return _react2.default.createElement(
        _semanticUiReact.Grid.Row,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { width: 16 },
          _react2.default.createElement(_semanticUiReact.Header, { as: 'h6', color: 'grey', content: header })
        ),
        Object.keys(filteredPrograms).map(function (key) {
          var programArr = filteredPrograms[key];

          return _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            { key: 'PL' + key },
            _react2.default.createElement(
              _semanticUiReact.List,
              { size: 'tiny' },
              _react2.default.createElement(
                _semanticUiReact.List.Item,
                null,
                _react2.default.createElement(
                  _semanticUiReact.List.Header,
                  null,
                  key,
                  _react2.default.createElement(_semanticUiReact.Divider, null)
                )
              ),
              programArr.map(function (prog) {
                return _react2.default.createElement(_semanticUiReact.List.Item, {
                  key: 'PF' + prog.program.id,
                  value: prog.program.id,
                  active: prog.program.id === program,
                  style: prog.program.id === program ? { backgroundColor: 'lightgoldenrodyellow' } : {},
                  onClick: _this.onSelectionProgramChange,
                  content: prog.program.name
                });
              })
            )
          );
        })
      );
    }, _this.createLeftMenu = function () {
      var _this$props2 = _this.props,
          genres = _this$props2.genres,
          t = _this$props2.t;

      var selected = _this.state.selection;
      var selectedGenre = selected ? selected.genre : null;
      return _react2.default.createElement(
        _semanticUiReact.Menu,
        { vertical: true, color: 'blue', size: 'tiny', fluid: true },
        _react2.default.createElement(_semanticUiReact.Menu.Item, {
          key: 0,
          value: null,
          style: selectedGenre === null ? { backgroundColor: 'lightgoldenrodyellow' } : {},
          active: selected === 0,
          onClick: _this.onSelectionGenreChange,
          content: t('programs.genres.all')
        }),
        genres.filter(function (x) {
          return !!x;
        }).map(function (genre) {
          var active = selectedGenre === genre;
          var style = active ? { backgroundColor: 'lightgoldenrodyellow' } : {};
          return _react2.default.createElement(_semanticUiReact.Menu.Item, {
            key: genre,
            value: { genre: genre },
            style: style,
            active: active,
            onClick: _this.onSelectionGenreChange,
            content: t('programs.genres.' + genre)
          });
        })
      );
    }, _this.createRecentlyUpdated = function () {
      var _this$props3 = _this.props,
          recentlyUpdated = _this$props3.recentlyUpdated,
          language = _this$props3.language,
          t = _this$props3.t;


      if (!Array.isArray(recentlyUpdated)) {
        return null;
      }

      return _react2.default.createElement(
        _semanticUiReact.Grid.Row,
        { stretched: true },
        _react2.default.createElement(
          _semanticUiReact.Grid.Column,
          { width: 16 },
          _react2.default.createElement(_semanticUiReact.Header, { as: 'h6', color: 'grey', content: t('filters.programs-filter.recently-updated') })
        ),
        recentlyUpdated.slice(0, 5).filter(function (x) {
          return x.collection;
        }).map(function (x) {
          var collection = x.collection,
              lastUpdate = x.last_update;

          return _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            { key: x.id },
            _react2.default.createElement(_semanticUiReact.Card, {
              as: _MultiLanguageLink2.default,
              to: (0, _utils.canonicalLink)(collection),
              language: language,
              header: collection.name,
              meta: t('filters.programs-filter.last-updated') + ': ' + t('values.date', { date: new Date(lastUpdate) }) })
          );
        })
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ProgramsFilter, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _utils.isEmpty)(nextProps.value)) {
        this.setState({ selection: nextProps.value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          t = _props.t,
          genres = _props.genres,
          programs = _props.programs;


      return _react2.default.createElement(
        _semanticUiReact.Segment,
        { basic: true, clearing: true, attached: 'bottom', className: 'tab active' },
        _react2.default.createElement(
          'div',
          { className: 'filter-steps' },
          _react2.default.createElement(
            'div',
            { className: 'filter-steps__column-wrapper' },
            _react2.default.createElement(
              'div',
              { className: 'filter-steps__column' },
              this.createLeftMenu(genres, t)
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'filter-steps__column-wrapper' },
            _react2.default.createElement(
              'div',
              { className: 'filter-steps__column' },
              _react2.default.createElement(
                _semanticUiReact.Grid,
                { padded: true, className: 'filter-steps__lists', columns: 5 },
                this.state.selection ? null : this.createRecentlyUpdated(t),
                this.createList(programs, t)
              )
            )
          )
        ),
        _react2.default.createElement(_semanticUiReact.Divider, null),
        _react2.default.createElement(
          _semanticUiReact.Segment,
          { vertical: true, clearing: true },
          _react2.default.createElement(_semanticUiReact.Button, { primary: true, content: t('buttons.apply'), floated: 'right', onClick: this.apply }),
          _react2.default.createElement(_semanticUiReact.Button, { content: t('buttons.cancel'), floated: 'right', onClick: this.onCancel })
        )
      );
    }
  }]);

  return ProgramsFilter;
}(_react.Component);

ProgramsFilter.propTypes = {
  onCancel: _propTypes2.default.func,
  onApply: _propTypes2.default.func,
  updateValue: _propTypes2.default.func.isRequired,
  value: _propTypes2.default.shape({
    genre: _propTypes2.default.string,
    program: _propTypes2.default.string
  }),
  t: _propTypes2.default.func.isRequired,
  genres: _propTypes2.default.arrayOf(_propTypes2.default.string),
  programs: _propTypes2.default.arrayOf(shapes.ProgramCollection),
  recentlyUpdated: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    last_update: _propTypes2.default.string.isRequired,
    units_count: _propTypes2.default.number.isRequired,
    collection: shapes.ProgramCollection
  })),
  language: _propTypes2.default.string.isRequired
};
ProgramsFilter.defaultProps = {
  onCancel: _noop2.default,
  onApply: _noop2.default,
  value: null,
  allValues: [],
  genres: [],
  programs: [],
  recentlyUpdated: [],
  recentlyUpdatedCollections: []
};
exports.default = (0, _reactRedux.connect)(function (state) {
  var recentlyUpdated = _programs.selectors.getRecentlyUpdated(state.programs).map(function (x) {
    return Object.assign({}, x, {
      collection: _mdb.selectors.getCollectionById(state.mdb, x.id)
    });
  });

  return {
    genres: _programs.selectors.getGenres(state.programs),
    programs: _programs.selectors.getPrograms(state.programs),
    recentlyUpdated: recentlyUpdated
  };
})((0, _connectFilter2.default)()(ProgramsFilter));