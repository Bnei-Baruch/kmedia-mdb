import { init, takePlayTiming } from '../adapter';

let now      = 0;
let handlers = {};
const fire   = (name, e = {}) => (handlers[name] || []).forEach(h => h(e));
const at     = (t, name, e) => {
  now = t; fire(name, e);
};

beforeEach(() => {
  now      = 0;
  handlers = {};
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  window.jwplayer = () => ({ on: (name, h) => (handlers[name] = [...(handlers[name] || []), h]), off: () => null, play: () => null });
  init(() => null, {});
  at(0, 'playlistItem', { item: { file: 'a.mp3', sources: [{ type: 'mp3' }] } });
});

test('reports startup and stalls per play segment', () => {
  at(100, 'beforePlay');
  at(250, 'buffer');          // startup buffering: part of click_to_play, not a stall
  at(400, 'time');
  at(1000, 'buffer');
  at(1300, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 300, rebuffer_count: 1, rebuffer_ms: 300 });

  at(5000, 'beforePlay');     // resume: new segment, no repeated values
  at(5100, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 100, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('ignores seek buffering and counts a stall open at stop', () => {
  at(0, 'beforePlay');
  at(100, 'time');
  at(200, 'seek');
  at(210, 'buffer');
  at(500, 'seeked');
  at(600, 'time');
  at(1000, 'buffer');
  now = 1700;                 // user gives up during the stall
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: 100, rebuffer_count: 1, rebuffer_ms: 700 });
});

test('never started, and other file', () => {
  at(0, 'beforePlay');
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });
  at(10, 'beforePlay');
  at(20, 'time');
  at(30, 'playlistItem', { item: { file: 'b.mp3', sources: [{ type: 'mp3' }] } });
  expect(takePlayTiming('a.mp3')).toEqual({ click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });
});
