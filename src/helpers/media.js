import { MT_AUDIO, MT_TEXT, MT_VIDEO } from './consts';

function makeMediaTypePredicate(...args) {
  return function predicate(file) {
    return args.some(x => x === file.type);
  };
}

function makeMimeTypePredicate(...args) {
  return function predicate(file) {
    return args.some(x => x === file.mimetype);
  };
}

function and(...args) {
  return function predicate(file) {
    return args.every(x => x(file));
  };
}

export default class MediaHelper {
  static IsVideo      = makeMediaTypePredicate(MT_VIDEO);
  static IsAudio      = makeMediaTypePredicate(MT_AUDIO);
  static IsText       = makeMediaTypePredicate(MT_TEXT);
  static IsImage      = makeMediaTypePredicate(MT_TEXT);
  static IsAudioVideo = makeMediaTypePredicate(MT_AUDIO, MT_VIDEO);

  static IsMp4      = and(MediaHelper.IsVideo, makeMimeTypePredicate('video/mp4'));
  static IsWmv      = and(MediaHelper.IsVideo, makeMimeTypePredicate('video/x-ms-wmv'));
  static IsFlv      = and(MediaHelper.IsVideo, makeMimeTypePredicate('video/x-flv'));

  static IsMp3      = and(MediaHelper.IsAudio, makeMimeTypePredicate('audio/mp3', 'audio/mpeg'));

  static IsHtml      = and(MediaHelper.IsText, makeMimeTypePredicate('text/html'));
}
