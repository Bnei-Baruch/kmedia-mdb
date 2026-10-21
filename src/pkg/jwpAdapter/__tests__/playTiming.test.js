import { init, takePlayTiming, markAutoPlay } from '../adapter';

const STATE_BY_EVENT = { play: 'playing', buffer: 'buffering', pause: 'paused', playlistItem: 'idle' };

let now      = 0;
let state    = 'idle';
let handlers = {};
const fire   = (name, e = {}) => {
  state = STATE_BY_EVENT[name] || state;
  (handlers[name] || []).forEach(h => h(e));
};

const at     = (t, name, e) => {
  now = t; fire(name, e);
};

const load   = (t, file, type = 'mp3') => at(t, 'playlistItem', { item: { file, sources: [{ type }] } });

beforeEach(() => {
  now      = 0;
  state    = 'idle';
  handlers = {};
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  window.jwplayer = () => ({
    on      : (name, h) => (handlers[name] = [...(handlers[name] || []), h]),
    off     : () => null,
    play    : () => null,
    getState: () => state
  });
  init(() => null, {});
  load(0, 'a.mp3');
});

test('reports startup and stalls per play segment', () => {
  at(100, 'beforePlay');
  at(250, 'buffer');          // startup buffering: part of click_to_play, not a stall
  at(390, 'play');
  at(400, 'time');
  at(1000, 'buffer');
  at(1300, 'play');
  at(1300, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 300, rebuffer_count: 1, rebuffer_ms: 300 });

  at(4000, 'pause');
  at(5000, 'beforePlay');     // resume: new segment, no repeated values
  at(5050, 'play');
  at(5100, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 100, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('ignores seek buffering; a stall ends at a seek and is counted if open at stop', () => {
  at(0, 'beforePlay');
  at(90, 'play');
  at(100, 'time');
  at(200, 'seek');
  at(210, 'buffer');
  at(500, 'seeked');
  at(500, 'play');
  at(600, 'time');
  at(1000, 'buffer');         // stall
  at(1200, 'seek');           // user seeks away from it: 200 ms counted
  at(1210, 'buffer');
  at(1500, 'time');           // seek's position tick while still buffering
  at(1600, 'seeked');
  at(1600, 'play');
  at(1700, 'time');
  at(2000, 'buffer');
  now = 2700;                 // user gives up during the stall
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 100, rebuffer_count: 2, rebuffer_ms: 900 });
});

test('a seek tick while paused is not a start; a user play after a blocked autoplay starts a user segment', () => {
  load(450, 'a.m3u8', 'hls');
  at(460, 'beforePlay');      // HLS autoplay, blocked by the browser
  at(470, 'pause');
  at(1230, 'seek');           // saved position
  at(1230, 'time');
  at(1280, 'seeked');
  at(14640, 'beforePlay');    // user click
  at(14641, 'buffer');
  at(14648, 'play');
  at(14900, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 260, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('never started; no intent (native resume)', () => {
  at(0, 'beforePlay');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });

  at(100, 'play');            // OS media keys: no beforePlay
  at(300, 'time');
  at(500, 'buffer');
  at(800, 'play');
  at(800, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', rebuffer_count: 1, rebuffer_ms: 300 });
});

test('the page\'s own start is tagged auto, with its first frame; a later user play is a user segment', () => {
  load(0, 'a.m3u8', 'hls');
  at(5, 'beforePlay');        // HLS autoplay on playlistItem
  at(400, 'play');
  at(400, 'firstFrame', { loadTime: 394.6 });
  at(650, 'time');
  markAutoPlay();             // BehaviorStartPlay, no autostart
  at(900, 'pause');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 645, first_frame_ms: 395, rebuffer_count: 0, rebuffer_ms: 0 });

  at(5000, 'beforePlay');     // user click; firstFrame fires once per file
  at(5010, 'play');
  at(5260, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 260, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('single-media HLS autostart is auto; a user play after an untaken auto segment starts clean', () => {
  load(0, 'a.m3u8', 'hls');
  at(5, 'beforePlay');        // HLS autoplay, page autostarts: no markAutoPlay
  at(300, 'play');
  at(300, 'firstFrame', { loadTime: 295 });
  at(550, 'time');
  at(3000, 'pause');          // user pause
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 545, first_frame_ms: 295, rebuffer_count: 0, rebuffer_ms: 0 });

  load(4000, 'b.m3u8', 'hls');
  at(4005, 'beforePlay');
  at(4300, 'play');
  at(4300, 'firstFrame', { loadTime: 295 });
  at(4550, 'time');
  markAutoPlay();
  at(4800, 'pause');          // its stop was never taken (player not ready yet)
  at(9000, 'beforePlay');     // user click
  at(9010, 'play');
  at(9250, 'time');
  expect(takePlayTiming('b.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 250, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('single-media HLS: a 2nd play() while buffering is not a new intent', () => {
  load(0, 'a.m3u8', 'hls');
  at(5, 'beforePlay');        // HLS autoplay on playlistItem
  at(6, 'buffer');
  at(260, 'beforePlay');      // BehaviorStartPlay play() (autostart) while still buffering
  at(262, 'play');
  at(262, 'firstFrame', { loadTime: 3.2 });
  at(480, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 475, first_frame_ms: 3, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('blocked autoplay leaves nothing behind; a media-key play is user', () => {
  load(0, 'a.m3u8', 'hls');
  at(460, 'beforePlay');      // HLS autoplay, blocked
  at(470, 'pause');
  at(470, 'playAttemptFailed');
  at(1240, 'seek');           // saved position: JWP reports the seek's frame as the first one
  at(1240, 'firstFrame', { loadTime: 758 });
  at(1290, 'seeked');
  markAutoPlay();             // BehaviorStartPlay, no autostart: its pause() is a no-op
  at(5000, 'play');           // OS media keys
  at(5250, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a saved-position seek before the no-autostart pause is auto too', () => {
  at(100, 'beforePlay');      // BehaviorStartPlay seek(offset) on an idle mp4
  at(100, 'seek');
  at(110, 'buffer');
  markAutoPlay();
  at(120, 'pause');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'auto', click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a stale stop is unknown and keeps the new file segment', () => {
  at(10, 'beforePlay');
  at(20, 'play');
  at(30, 'time');
  load(40, 'b.mp3');
  at(50, 'beforePlay');
  at(60, 'play');
  at(80, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({});
  expect(takePlayTiming('b.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 30, rebuffer_count: 0, rebuffer_ms: 0 });
});
