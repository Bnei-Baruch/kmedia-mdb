'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment-duration-format');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../../helpers/utils');

var _shapes = require('../../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _Splash = require('../../../shared/Splash');

var _MultiLanguageLink = require('../../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

var _UnitLogo = require('../../../shared/Logo/UnitLogo');

var _UnitLogo2 = _interopRequireDefault(_UnitLogo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RelevantParts = function RelevantParts(props) {
  var unit = props.unit,
      collection = props.collection,
      wip = props.wip,
      err = props.err,
      t = props.t;


  if (err) {
    return _react2.default.createElement(_Splash.ErrorSplash, { text: t('messages.server-error'), subtext: (0, _utils.formatError)(err) });
  }

  if (wip) {
    return _react2.default.createElement(_Splash.LoadingSplash, { text: t('messages.loading'), subtext: t('messages.loading-subtext') });
  }

  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  var idx = collection.content_units.findIndex(function (x) {
    return x.id === unit.id;
  });
  var neighbors = (0, _utils.neighborIndices)(idx, collection.content_units.length, 3);
  var otherParts = neighbors.map(function (x) {
    return collection.content_units[x];
  });

  if (otherParts.length === 0) {
    return null;
  }

  return _react2.default.createElement(
    'div',
    { style: { marginTop: '50px' } },
    _react2.default.createElement(_semanticUiReact.Header, { as: 'h3', content: t('lessons.part.relevant-parts.title') }),
    _react2.default.createElement(
      _semanticUiReact.Item.Group,
      { divided: true, link: true },
      otherParts.map(function (part) {
        return _react2.default.createElement(
          _semanticUiReact.Item,
          { as: _MultiLanguageLink2.default, key: part.id, to: '/lessons/part/' + part.id },
          _react2.default.createElement(
            _semanticUiReact.Item.Image,
            { size: 'tiny' },
            _react2.default.createElement(_UnitLogo2.default, { unitId: part.id, collectionId: collection.id })
          ),
          _react2.default.createElement(
            _semanticUiReact.Item.Content,
            null,
            _react2.default.createElement(_semanticUiReact.Header, {
              as: 'h4',
              content: t('lessons.part.relevant-parts.item-title', { name: collection.ccuNames[part.id] })
            }),
            _react2.default.createElement(
              _semanticUiReact.Item.Meta,
              null,
              _react2.default.createElement(
                'small',
                null,
                _moment2.default.duration(part.duration, 'seconds').format('hh:mm:ss')
              )
            ),
            _react2.default.createElement(
              _semanticUiReact.Item.Description,
              null,
              part.name
            )
          )
        );
      }),
      _react2.default.createElement(
        _semanticUiReact.Item,
        null,
        _react2.default.createElement(
          _semanticUiReact.Item.Content,
          null,
          _react2.default.createElement(
            _semanticUiReact.Container,
            {
              fluid: true,
              as: _MultiLanguageLink2.default,
              textAlign: 'right',
              to: '/lessons/full/' + collection.id
            },
            t('buttons.more'),
            ' \xBB'
          )
        )
      )
    )
  );
};

RelevantParts.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: _propTypes2.default.func.isRequired
};

RelevantParts.defaultProps = {
  collection: null,
  wip: false,
  err: null
};

exports.default = RelevantParts;