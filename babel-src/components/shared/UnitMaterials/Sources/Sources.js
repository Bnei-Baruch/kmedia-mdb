'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../../../helpers/consts');

var _utils = require('../../../../helpers/utils');

var _shapes = require('../../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../../../shared/Splash');

var _LanguageSelector = require('../../LanguageSelector');

var _LanguageSelector2 = _interopRequireDefault(_LanguageSelector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sources = function (_Component) {
  _inherits(Sources, _Component);

  function Sources() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Sources);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Sources.__proto__ || Object.getPrototypeOf(Sources)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      options: [],
      languages: [],
      selected: null,
      language: null
    }, _this.getSourceOptions = function (props) {
      var unit = props.unit,
          indexMap = props.indexMap,
          getSourceById = props.getSourceById;

      return (unit.sources || []).map(getSourceById).filter(function (x) {
        return !!x;
      }).map(function (x) {
        return {
          value: x.id,
          text: (0, _utils.tracePath)(x, getSourceById).map(function (y) {
            return y.name;
          }).join(' > '),
          disabled: !indexMap[x.id] || !indexMap[x.id].data
        };
      });
    }, _this.getLanguages = function (idx, preferred) {
      if (!idx || !idx.data) {
        return { languages: [], language: null };
      }

      var language = null;
      var languages = Array.from(Object.keys(idx.data));
      if (languages.length > 0) {
        language = languages.indexOf(preferred) === -1 ? languages[0] : preferred;
      }

      return { languages: languages, language: language };
    }, _this.changeContent = function (selected, language, idxMap) {
      _this.props.onContentChange(selected, idxMap[selected].data[language].html);
    }, _this.myReplaceState = function (nextProps) {
      var options = _this.getSourceOptions(nextProps);
      var available = options.filter(function (x) {
        return !x.disabled;
      });
      var selected = available.length > 0 ? available[0].value : null;

      var _this$getLanguages = _this.getLanguages(nextProps.indexMap[selected], nextProps.language),
          languages = _this$getLanguages.languages,
          language = _this$getLanguages.language;

      _this.setState({ options: options, languages: languages, language: language, selected: selected });

      if (selected && language) {
        _this.changeContent(selected, language, nextProps.indexMap);
      }
    }, _this.handleSourceChanged = function (e, data) {
      var selected = data.value;

      if (_this.state.selected === selected) {
        e.preventDefault();
        return;
      }

      var _this$getLanguages2 = _this.getLanguages(_this.props.indexMap[selected], _this.props.language),
          languages = _this$getLanguages2.languages,
          language = _this$getLanguages2.language;

      _this.setState({ selected: selected, languages: languages, language: language });
      if (selected && language) {
        _this.changeContent(selected, language, _this.props.indexMap);
      }
    }, _this.handleLanguageChanged = function (e, language) {
      _this.changeContent(_this.state.selected, language, _this.props.indexMap);
      _this.setState({ language: language });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Sources, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.myReplaceState(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // unit has changed - replace all state
      if (nextProps.unit.sources !== this.props.unit.sources) {
        this.myReplaceState(nextProps);
        return;
      }

      // index data changed
      if (nextProps.indexMap !== this.props.indexMap) {
        var selected = this.state.selected;

        // if no previous selection - replace all state
        if (!selected) {
          this.myReplaceState(nextProps);
        } else {
          var idx = this.props.indexMap[selected];
          var nIdx = nextProps.indexMap[selected];

          // if prev idx for current selection is missing and now we have it - use it
          if (nIdx && nIdx.data && !(idx && idx.data)) {
            var options = this.getSourceOptions(nextProps);

            var _getLanguages = this.getLanguages(nIdx, nextProps.language),
                languages = _getLanguages.languages,
                language = _getLanguages.language;

            this.setState({ options: options, languages: languages, language: language });
            if (language) {
              this.changeContent(selected, language, nextProps.indexMap);
            }
          } else {
            // we keep previous selection. Source options must be updated anyway
            this.setState({ options: this.getSourceOptions(nextProps) });
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          content = _props.content,
          t = _props.t;
      var _state = this.state,
          options = _state.options,
          selected = _state.selected,
          languages = _state.languages,
          language = _state.language;


      if (options.length === 0) {
        return _react2.default.createElement(
          _semanticUiReact.Segment,
          { basic: true },
          t('materials.sources.no-sources')
        );
      }

      if (!selected) {
        return _react2.default.createElement(
          _semanticUiReact.Segment,
          { basic: true },
          t('materials.sources.no-source-available')
        );
      }

      var contentWip = content.wip,
          contentErr = content.err,
          contentData = content.data;


      var contents = void 0;
      if (contentErr) {
        if (contentErr.response && contentErr.response.status === 404) {
          contents = _react2.default.createElement(_Splash.FrownSplash, {
            text: t('messages.source-content-not-found')
          });
        } else {
          contents = _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(contentErr) });
        }
      } else if (contentWip) {
        contents = _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
      } else {
        var direction = _consts.RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
        contents = _react2.default.createElement('div', { style: { direction: direction }, dangerouslySetInnerHTML: { __html: contentData } });
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid,
          { stackable: true },
          _react2.default.createElement(
            _semanticUiReact.Grid.Row,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              { width: 8 },
              _react2.default.createElement(_semanticUiReact.Dropdown, {
                fluid: true,
                selection: true,
                value: selected,
                options: options,
                selectOnBlur: false,
                selectOnNavigation: false,
                onChange: this.handleSourceChanged
              })
            ),
            languages.length > 0 ? _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              { width: 4 },
              _react2.default.createElement(_LanguageSelector2.default, {
                languages: languages,
                defaultValue: language,
                t: t,
                onSelect: this.handleLanguageChanged
              })
            ) : null
          )
        ),
        _react2.default.createElement(_semanticUiReact.Divider, { hidden: true }),
        contents
      );
    }
  }]);

  return Sources;
}(_react.Component);

Sources.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  indexMap: _propTypes2.default.objectOf(_propTypes2.default.shape({
    data: _propTypes2.default.object, // content index
    wip: shapes.WIP,
    err: shapes.Error
  })).isRequired,
  content: _propTypes2.default.shape({
    data: _propTypes2.default.string, // actual content (HTML)
    wip: shapes.WIP,
    err: shapes.Error
  }).isRequired,
  language: _propTypes2.default.string.isRequired,
  t: _propTypes2.default.func.isRequired,
  onContentChange: _propTypes2.default.func.isRequired,
  getSourceById: _propTypes2.default.func.isRequired
};
exports.default = Sources;