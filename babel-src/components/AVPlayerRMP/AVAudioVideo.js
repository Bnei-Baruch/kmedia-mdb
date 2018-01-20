'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TimedPopup = require('../shared/TimedPopup');

var _TimedPopup2 = _interopRequireDefault(_TimedPopup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AVAudioVideo = function AVAudioVideo(props) {
  var isAudio = props.isAudio,
      setAudio = props.setAudio,
      isVideo = props.isVideo,
      setVideo = props.setVideo,
      t = props.t,
      fallbackMedia = props.fallbackMedia;


  var popup = !fallbackMedia ? null : _react2.default.createElement(_TimedPopup2.default, {
    openOnInit: true,
    message: isAudio ? t('messages.fallback-to-audio') : t('messages.fallback-to-video'),
    downward: isAudio,
    timeout: 7000
  });

  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)('player-button player-control-audio-video') },
    popup,
    _react2.default.createElement(
      'div',
      {
        style: { textDecoration: isAudio ? 'underline' : 'none' },
        role: 'button',
        tabIndex: '0',
        onClick: setAudio
      },
      t('buttons.audio')
    ),
    _react2.default.createElement(
      'span',
      null,
      '\xA0/\xA0'
    ),
    _react2.default.createElement(
      'div',
      {
        style: { textDecoration: isVideo ? 'underline' : 'none' },
        role: 'button',
        tabIndex: '0',
        onClick: setVideo
      },
      t('buttons.video')
    )
  );
};

AVAudioVideo.propTypes = {
  isAudio: _propTypes2.default.bool.isRequired,
  setAudio: _propTypes2.default.func.isRequired,
  isVideo: _propTypes2.default.bool.isRequired,
  setVideo: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired,
  fallbackMedia: _propTypes2.default.bool.isRequired
};

exports.default = AVAudioVideo;