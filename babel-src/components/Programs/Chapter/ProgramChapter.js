'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactI18next = require('react-i18next');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../helpers/utils');

var _Splash = require('../../shared/Splash');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _RMPVideoBox = require('../../shared/UnitPlayer/RMPVideoBox');

var _RMPVideoBox2 = _interopRequireDefault(_RMPVideoBox);

var _Materials = require('../../shared/UnitMaterials/Materials');

var _Materials2 = _interopRequireDefault(_Materials);

var _MediaDownloads = require('../../shared/MediaDownloads');

var _MediaDownloads2 = _interopRequireDefault(_MediaDownloads);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _RelevantPartsContainer = require('./RelevantParts/RelevantPartsContainer');

var _RelevantPartsContainer2 = _interopRequireDefault(_RelevantPartsContainer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProgramChapter = function ProgramChapter(props) {
  var chapter = props.chapter,
      wip = props.wip,
      err = props.err,
      language = props.language,
      t = props.t;


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

  if (!chapter) {
    return null;
  }

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'avbox' },
      _react2.default.createElement(
        _semanticUiReact.Container,
        null,
        _react2.default.createElement(
          _semanticUiReact.Grid,
          { centered: true, padded: true },
          _react2.default.createElement(_RMPVideoBox2.default, { unit: chapter, language: language, t: t, isSliceable: true })
        )
      )
    ),
    _react2.default.createElement(
      _semanticUiReact.Container,
      null,
      _react2.default.createElement(
        _semanticUiReact.Grid,
        { padded: true },
        _react2.default.createElement(
          _semanticUiReact.Grid.Row,
          null,
          _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            { width: 10 },
            _react2.default.createElement(_Info2.default, { unit: chapter, t: t }),
            _react2.default.createElement(_Materials2.default, { unit: chapter, t: t })
          ),
          _react2.default.createElement(
            _semanticUiReact.Grid.Column,
            { width: 6 },
            _react2.default.createElement(_MediaDownloads2.default, { unit: chapter, language: language, t: t }),
            _react2.default.createElement(_RelevantPartsContainer2.default, { unit: chapter, t: t })
          )
        )
      )
    )
  );
};

ProgramChapter.propTypes = {
  chapter: shapes.ProgramChapter,
  language: _propTypes2.default.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: _propTypes2.default.func.isRequired
};

ProgramChapter.defaultProps = {
  chapter: null,
  wip: false,
  err: null
};

exports.default = (0, _reactI18next.translate)()(ProgramChapter);