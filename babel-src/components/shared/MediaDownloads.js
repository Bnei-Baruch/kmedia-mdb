'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCopyToClipboard = require('react-copy-to-clipboard');

var _reactCopyToClipboard2 = _interopRequireDefault(_reactCopyToClipboard);

var _semanticUiReact = require('semantic-ui-react');

var _consts = require('../../helpers/consts');

var _utils = require('../../helpers/utils');

var _shapes = require('../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _LanguageSelector = require('../shared/LanguageSelector');

var _LanguageSelector2 = _interopRequireDefault(_LanguageSelector);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MEDIA_ORDER = [_consts.MT_VIDEO, _consts.MT_AUDIO, _consts.MT_TEXT, _consts.MT_IMAGE];

var MediaDownloads = function (_Component) {
  _inherits(MediaDownloads, _Component);

  function MediaDownloads(props) {
    _classCallCheck(this, MediaDownloads);

    var _this = _possibleConstructorReturn(this, (MediaDownloads.__proto__ || Object.getPrototypeOf(MediaDownloads)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = _this.getInitialState(props);
    return _this;
  }

  _createClass(MediaDownloads, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var unit = nextProps.unit,
          language = nextProps.language;

      var props = this.props;
      var state = this.state;

      // no change
      if (unit === props.unit && language === props.language) {
        return;
      }

      // only language changed
      if (unit === props.unit && language !== props.language) {
        if (state.groups.has(language)) {
          this.setState({ language: language });
          return;
        }
      }

      // unit changed, maybe language as well
      var groups = this.getFilesByLanguage(unit.files);
      var lang = void 0;
      if (groups.has(language)) {
        lang = language;
      } else if (groups.has(state.language)) {
        lang = state.language;
      } else {
        lang = groups.keys().next().value;
      }

      var derivedGroups = state.derivedGroups;
      if (unit.derived_units !== props.unit.derived_units) {
        derivedGroups = this.getDerivedFilesByContentType(unit.derived_units);
      }

      this.setState({
        groups: groups,
        language: lang,
        derivedGroups: derivedGroups
      });
    }

    // TODO: implement once fallback language is known

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var t = this.props.t;
      var _state = this.state,
          language = _state.language,
          groups = _state.groups,
          derivedGroups = _state.derivedGroups;

      var byType = groups.get(language) || new Map();
      var kiteiMakor = derivedGroups[_consts.CT_KITEI_MAKOR];
      var kiteiMakorByType = kiteiMakor && kiteiMakor.get(language) || new Map();

      var typeOverrides = this.getI18nTypeOverridesKey();
      if (typeOverrides) {
        typeOverrides += '.';
      }

      var rows = void 0;
      if (byType.size === 0) {
        rows = [_react2.default.createElement(
          _semanticUiReact.Table.Row,
          { key: '0' },
          _react2.default.createElement(
            _semanticUiReact.Table.Cell,
            null,
            t('messages.no-files')
          )
        )];
      } else {
        rows = MEDIA_ORDER.reduce(function (acc, val) {
          var label = t('media-downloads.' + typeOverrides + 'type-labels.' + val);
          var files = (byType.get(val) || []).map(function (file) {
            return _this2.renderRow(file, label, t);
          });
          return acc.concat(files);
        }, []);
      }

      var derivedRows = void 0;
      if (kiteiMakorByType.size > 0) {
        derivedRows = MEDIA_ORDER.reduce(function (acc, val) {
          var label = t('constants.content-types.KITEI_MAKOR') + ' - ' + t('constants.media-types.' + val);
          var files = (kiteiMakorByType.get(val) || []).map(function (file) {
            return _this2.renderRow(file, label, t);
          });
          return acc.concat(files);
        }, []);
      }

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid,
          { columns: 'equal' },
          _react2.default.createElement(
            _semanticUiReact.Grid.Row,
            null,
            _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              null,
              _react2.default.createElement(_semanticUiReact.Header, { as: 'h3', content: t('media-downloads.title') })
            ),
            _react2.default.createElement(
              _semanticUiReact.Grid.Column,
              null,
              _react2.default.createElement(_LanguageSelector2.default, {
                languages: Array.from(groups.keys()),
                defaultValue: language,
                onSelect: this.handleChangeLanguage
              })
            )
          )
        ),
        _react2.default.createElement(
          _semanticUiReact.Table,
          { basic: 'very', compact: 'very', unstackable: true },
          _react2.default.createElement(
            _semanticUiReact.Table.Body,
            null,
            rows
          )
        ),
        derivedRows ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_semanticUiReact.Header, { size: 'tiny', content: t('media-downloads.derived-title') }),
          _react2.default.createElement(
            _semanticUiReact.Table,
            { basic: 'very', compact: 'very' },
            _react2.default.createElement(
              _semanticUiReact.Table.Body,
              null,
              derivedRows
            )
          )
        ) : null
      );
    }
  }]);

  return MediaDownloads;
}(_react.Component);

MediaDownloads.propTypes = {
  language: _propTypes2.default.string.isRequired,
  unit: shapes.ContentUnit,
  t: _propTypes2.default.func.isRequired
};
MediaDownloads.defaultProps = {
  unit: undefined
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getInitialState = function (props) {
    var _props$unit = props.unit,
        unit = _props$unit === undefined ? {} : _props$unit;

    var groups = _this3.getFilesByLanguage(unit.files);
    var derivedGroups = _this3.getDerivedFilesByContentType(unit.derived_units);

    var language = props.language;
    if (!groups.has(language)) {
      language = groups.keys().next().value;
    }

    return { groups: groups, language: language, derivedGroups: derivedGroups };
  };

  this.fallbackImages = function (images, language) {
    return images[0];
  };

  this.getFilesByLanguage = function (files) {
    var groups = new Map();

    // keep track of image files. These are a special case.
    // Images, unlike other types, are language agnostic by nature.
    // However, since they might contain text in them we do have language attached to such files.
    // For other languages, whom don't have a dedicated translation of these images
    // we give them the images of their fallback language.
    var images = [];

    (files || []).forEach(function (file) {
      if (!groups.has(file.language)) {
        groups.set(file.language, new Map());
      }

      var byType = groups.get(file.language);
      if (!byType.has(file.type)) {
        byType.set(file.type, []);
      }
      byType.get(file.type).push(file);

      if (file.type === _consts.MT_IMAGE) {
        images.push(file);
      }
    });

    // sort file lists by size
    groups.forEach(function (byType) {
      return byType.forEach(function (v) {
        return v.sort(function (a, b) {
          return a.size - b.size;
        });
      });
    });

    // fill in images fallback into every language
    if (images.length > 0) {
      groups.forEach(function (byType, language) {
        if (!byType.has(_consts.MT_IMAGE)) {
          byType.set(_consts.MT_IMAGE, [_this3.fallbackImages(images, language)]);
        }
      });
    }

    return groups;
  };

  this.getDerivedFilesByContentType = function (units) {
    return Object.values(units || {}).reduce(function (acc, val) {
      acc[val.content_type] = _this3.getFilesByLanguage(val.files);
      return acc;
    }, {});
  };

  this.handleChangeLanguage = function (e, language) {
    _this3.setState({ language: language });
  };

  this.renderRow = function (file, label, t) {
    var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    var url = (0, _utils.physicalFile)(file);

    return _react2.default.createElement(
      _semanticUiReact.Table.Row,
      { key: file.id, verticalAlign: 'top' },
      _react2.default.createElement(
        _semanticUiReact.Table.Cell,
        null,
        label
      ),
      _react2.default.createElement(
        _semanticUiReact.Table.Cell,
        { collapsing: true },
        _react2.default.createElement(_semanticUiReact.Button, {
          compact: true,
          fluid: true,
          as: 'a',
          href: url,
          target: '_blank',
          size: 'mini',
          color: 'orange',
          content: ext.toUpperCase()
        })
      ),
      _react2.default.createElement(
        _semanticUiReact.Table.Cell,
        { collapsing: true },
        _react2.default.createElement(
          _reactCopyToClipboard2.default,
          { text: url },
          _react2.default.createElement(_semanticUiReact.Button, {
            compact: true,
            fluid: true,
            size: 'mini',
            color: 'orange',
            content: t('buttons.copy-link')
          })
        )
      )
    );
  };

  this.getI18nTypeOverridesKey = function () {
    switch (_this3.props.unit.content_type) {
      case _consts.CT_LESSON_PART:
      case _consts.CT_FULL_LESSON:
        return 'lesson';
      case _consts.CT_VIDEO_PROGRAM_CHAPTER:
        return 'program';
      default:
        return '';
    }
  };
};

exports.default = MediaDownloads;