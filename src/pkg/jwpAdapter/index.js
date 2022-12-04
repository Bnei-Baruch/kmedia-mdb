import useSubscribeSeekAndTime from './useSubscribeSeekAndTime';
import useSubscribeBuffer from './useSubscribeBuffer';
import useStartStopSlice from './useStartStopSlice';
import useSubscribeVolume from './useSubscribeVolume';
import { getDuration, play, pause, seek, getMute, setMute, setVolume, getPosition, setPlaybackRate } from './adapter';
import useStartPlay from './useStartPlay';

const exports = {
  useSubscribeSeekAndTime: useSubscribeSeekAndTime,
  useSubscribeBuffer: useSubscribeBuffer,
  useSubscribeVolume: useSubscribeVolume,
  useStartStopSlice: useStartStopSlice,
  useStartPlay: useStartPlay,
  getDuration: getDuration,
  getPosition: getPosition,
  getMute: getMute,
  setMute: setMute,
  setVolume: setVolume,
  setPlaybackRate: setPlaybackRate,
  play: play,
  pause: pause,
  seek: seek,
};

export default exports;
