import { init, takePlayTiming, dropPlayIntent } from '../adapter';

const STATE_BY_EVENT = { play: 'playing', buffer: 'buffering', pause: 'paused' };

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

const load   = (t, file) => at(t, 'playlistItem', { item: { file, sources: [{ type: 'mp3' }] } });

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
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 300, rebuffer_count: 1, rebuffer_ms: 300 });

  at(5000, 'beforePlay');     // resume: new segment, no repeated values
  at(5050, 'play');
  at(5100, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 100, rebuffer_count: 0, rebuffer_ms: 0 });
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
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 100, rebuffer_count: 2, rebuffer_ms: 900 });
});

test('a seek tick while paused is not a start; the user play re-anchors the intent', () => {
  at(460, 'beforePlay');      // HLS autoplay, blocked by the browser
  at(470, 'pause');
  at(1230, 'seek');           // saved position
  at(1230, 'time');
  at(1280, 'seeked');
  at(14640, 'beforePlay');    // user click
  at(14641, 'buffer');
  at(14648, 'play');
  at(14900, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 260, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('never started; no intent (native resume); dropped programmatic play', () => {
  at(0, 'beforePlay');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });

  at(100, 'play');            // OS media keys: no beforePlay
  at(300, 'time');
  at(500, 'buffer');
  at(800, 'play');
  at(800, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ rebuffer_count: 1, rebuffer_ms: 300 });

  at(1000, 'beforePlay');      // programmatic HLS play, paused by BehaviorStartPlay (no autostart)
  at(1100, 'play');
  at(1200, 'time');
  dropPlayIntent();
  at(1300, 'time');           // the media's last tick before its pause
  at(1300, 'pause');
  expect(takePlayTiming('a.mp3')).toEqual({});

  dropPlayIntent();           // autoplay was blocked: already paused, the pause() emits nothing
  at(2100, 'play');           // later resumed with OS media keys (no beforePlay)
  at(2200, 'time');
  at(3000, 'pause');
  expect(takePlayTiming('a.mp3')).toEqual({ rebuffer_count: 0, rebuffer_ms: 0 });
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
  expect(takePlayTiming('b.mp3')).toEqual({ click_to_play_ms: 30, rebuffer_count: 0, rebuffer_ms: 0 });
});
