import { init, takePlayTiming } from '../adapter';
import chronicles from '../../../redux/modules/chronicles';
import { actions as player } from '../../../redux/modules/player';

const STATE_BY_EVENT = { play: 'playing', buffer: 'buffering', pause: 'paused', idle: 'idle', complete: 'complete' };

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

// the browser's user activation: active for 5 s after a user gesture (click, key)
let gestureAt     = -Infinity;
const gesture     = t => (gestureAt = t);
const click       = t => {   // the user clicks play
  gesture(t); at(t, 'beforePlay');
};

beforeEach(() => {
  now       = 0;
  state     = 'idle';
  handlers  = {};
  gestureAt = -Infinity;
  Object.defineProperty(navigator, 'userActivation', { configurable: true, value: { get isActive() { return now - gestureAt < 5000; } } });
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  window.jwplayer = () => ({
    id      : 'test',
    on      : (name, h) => (handlers[name] = [...(handlers[name] || []), h]),
    off     : () => null,
    play    : () => null,
    getState: () => state
  });
  init(() => null, {});
  load(0, 'a.mp3');
});

test('reports startup and stalls per play segment', () => {
  click(100);
  at(250, 'buffer');          // startup buffering: part of click_to_play, not a stall
  at(390, 'play');
  at(400, 'time');
  at(1000, 'buffer');
  at(1300, 'play');
  at(1300, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 300, rebuffer_count: 1, rebuffer_ms: 300 });

  at(4000, 'pause');
  click(5000);     // resume: new segment, no repeated values
  at(5050, 'play');
  at(5100, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 100, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('ignores seek buffering; a stall ends at a seek and is counted if open at stop', () => {
  click(0);
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
  click(14640);    // user click
  at(14641, 'buffer');
  at(14648, 'play');
  at(14900, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 260, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a seek while paused doesn\'t start the next play; an untaken stop doesn\'t leak into it', () => {
  click(0);
  at(10, 'play');
  at(250, 'time');
  at(1000, 'pause');
  takePlayTiming('a.mp3');
  at(2000, 'seek');           // seek while paused: a position tick, not playing
  at(2000, 'time');
  at(2050, 'seeked');
  click(3000);
  at(3010, 'play');
  at(3200, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 200, rebuffer_count: 0, rebuffer_ms: 0 });

  at(4000, 'play');           // keeps playing after that stop (e.g. a stop on page leave)
  at(4250, 'time');
  at(5000, 'buffer');         // a stall, then a pause whose stop is not taken
  at(5400, 'play');
  at(5400, 'time');
  at(6000, 'pause');
  click(7000);
  at(7010, 'play');
  at(7200, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 200, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('never started; no intent (native resume)', () => {
  click(0);
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });

  at(100, 'play');            // OS media keys: no beforePlay
  at(100, 'firstFrame');
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
  at(400, 'firstFrame');
  at(650, 'time');
  at(900, 'pause');           // BehaviorStartPlay, no autostart
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 645, first_frame_ms: 395, rebuffer_count: 0, rebuffer_ms: 0 });

  click(5000);     // user click; firstFrame fires once per file
  at(5010, 'play');
  at(5260, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 260, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('single-media HLS autostart is auto; a user play after an untaken auto segment starts clean', () => {
  load(0, 'a.m3u8', 'hls');
  at(5, 'beforePlay');        // HLS autoplay, page autostarts
  at(300, 'play');
  at(300, 'firstFrame');
  at(550, 'time');
  at(3000, 'pause');          // user pause
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 545, first_frame_ms: 295, rebuffer_count: 0, rebuffer_ms: 0 });

  at(3990, 'idle');
  load(4000, 'b.m3u8', 'hls');
  at(4005, 'beforePlay');
  at(4300, 'play');
  at(4300, 'firstFrame');
  at(4550, 'time');
  at(4800, 'pause');          // BehaviorStartPlay, no autostart; its stop was never taken (player not ready yet)
  click(9000);     // user click
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
  at(262, 'firstFrame');      // JWP's loadTime here would be 3 ms (counted from the 2nd play())
  at(480, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'auto', click_to_play_ms: 475, first_frame_ms: 257, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('blocked autoplay leaves nothing behind; the next click is a user start', () => {
  load(0, 'a.m3u8', 'hls');
  at(460, 'beforePlay');      // HLS autoplay, blocked
  at(470, 'pause');
  at(470, 'playAttemptFailed');
  at(1240, 'seek');           // JWP reports the seek's frame as the first one
  at(1240, 'firstFrame');
  at(1290, 'seeked');
  click(7000);     // user click
  at(7010, 'play');
  at(7250, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', click_to_play_ms: 250, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a media-key play after a blocked autoplay is user, not timed from the blocked attempt', () => {
  load(0, 'a.m3u8', 'hls');
  at(460, 'beforePlay');      // HLS autoplay, blocked
  at(470, 'pause');
  at(470, 'playAttemptFailed');
  at(9000, 'play');           // OS media keys
  at(9250, 'time');
  expect(takePlayTiming('a.m3u8')).toEqual({ start_trigger: 'user', rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a saved-position seek before the no-autostart pause is auto too', () => {
  at(100, 'beforePlay');
  at(100, 'seek');
  at(110, 'buffer');
  at(112, 'time');            // the seek's position tick while buffering: not a start
  at(115, 'firstFrame');      // the frame at the saved position, not a start
  at(120, 'pause');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'auto', click_to_play_ms: null, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('next unit autoplay after complete is auto; an HLS audio/video switch while playing is user', () => {
  click(10);
  at(20, 'play');
  at(30, 'time');
  at(5000, 'complete');
  takePlayTiming('a.mp3');    // a stop for the old file may come before the next unit loads: no effect on it
  load(5010, 'b.mp4');
  at(5020, 'beforePlay');     // JWP plays the next unit itself
  at(5040, 'play');
  at(5040, 'firstFrame');
  at(5300, 'time');
  expect(takePlayTiming('b.mp4')).toEqual({ start_trigger: 'auto', click_to_play_ms: 280, first_frame_ms: 20, rebuffer_count: 0, rebuffer_ms: 0 });

  load(6000, 'c.m3u8', 'hls');
  click(6010);
  at(6100, 'play');
  at(6350, 'time');
  gesture(7000);
  load(7000, 'c.m3u8?no_video=true', 'hls');   // user switches to audio while playing
  at(7001, 'idle');
  at(7002, 'beforePlay');     // the reload's HLS play()
  at(7080, 'play');
  at(7330, 'time');
  expect(takePlayTiming('c.m3u8?no_video=true')).toEqual({ start_trigger: 'user', click_to_play_ms: 328, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('an mp4 audio/video switch while playing is user, though BehaviorStartPlay restarts it', () => {
  click(10);
  at(20, 'play');
  at(30, 'time');
  gesture(5000);
  load(5000, 'a.mp3?audio');  // user switches to audio while playing
  at(5001, 'idle');
  expect(takePlayTiming('a.mp3?audio')).toEqual({});   // a stop for the new file before its play: nothing to report
  at(5010, 'beforePlay');
  at(5040, 'play');
  at(5300, 'time');
  expect(takePlayTiming('a.mp3?audio')).toEqual({ start_trigger: 'user', click_to_play_ms: 290, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('an mp4 page load is not marked: the user\'s first click is user', () => {
  load(10, 'b.mp4');
  click(3000);
  at(3010, 'play');
  at(3250, 'time');
  expect(takePlayTiming('b.mp4')).toEqual({ start_trigger: 'user', click_to_play_ms: 250, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a stale stop is unknown and keeps the new file segment', () => {
  click(10);
  at(20, 'play');
  at(30, 'time');
  load(40, 'b.mp3');
  at(45, 'idle');
  click(50);
  at(60, 'play');
  at(80, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({});
  expect(takePlayTiming('b.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 30, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('a late stop takes the segment a new file replaced, whether it comes before or after the new file loads', () => {
  click(10);
  at(20, 'play');
  at(30, 'time');
  at(100, 'buffer');          // a stall open at the switch: closed there
  load(400, 'b.mp3');         // a same-path switch while playing: no stop for a.mp3 yet
  at(401, 'idle');
  click(410);
  at(420, 'play');
  at(450, 'time');
  expect(takePlayTiming('a.mp3', true)).toEqual({ start_trigger: 'user', click_to_play_ms: 20, rebuffer_count: 1, rebuffer_ms: 300 });
  expect(takePlayTiming('a.mp3', true)).toEqual({});   // taken once
  expect(takePlayTiming('b.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 40, rebuffer_count: 0, rebuffer_ms: 0 });

  at(480, 'pause');           // its stop is lost too
  click(500);      // b plays again; the late stop runs before the next file loads: takes the current segment
  at(510, 'play');
  at(530, 'time');
  expect(takePlayTiming('b.mp3', true)).toEqual({ start_trigger: 'user', click_to_play_ms: 30, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('the page\'s own advance to the next file while playing (no user gesture) is auto, though the late stop came first', () => {
  click(10);
  at(20, 'play');
  at(30, 'time');
  expect(takePlayTiming('a.mp3', true)).toEqual({ start_trigger: 'user', click_to_play_ms: 20, rebuffer_count: 0, rebuffer_ms: 0 });
  load(5000, 'b.mp3');
  at(5001, 'idle');
  at(5010, 'beforePlay');
  at(5040, 'play');
  at(5100, 'time');
  expect(takePlayTiming('b.mp3')).toEqual({ start_trigger: 'auto', click_to_play_ms: 90, rebuffer_count: 0, rebuffer_ms: 0 });

  gesture(6000);
  load(6000, 'c.mp3');        // a later user switch is user again
  at(6001, 'idle');
  at(6010, 'beforePlay');
  at(6020, 'play');
  at(6050, 'time');
  expect(takePlayTiming('c.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 40, rebuffer_count: 0, rebuffer_ms: 0 });
});

test('without the userActivation API every start is user', () => {
  delete navigator.userActivation;
  load(0, 'a.m3u8', 'hls');
  at(5, 'beforePlay');        // HLS autoplay
  at(300, 'play');
  at(550, 'time');
  expect(takePlayTiming('a.m3u8')).toMatchObject({ start_trigger: 'user' });
});

test('the end of the file stops the play; a replay is its own segment', () => {
  expect(chronicles(undefined, player.playerComplete()).event).toBe('player-stop');
  click(0);
  at(200, 'play');
  at(200, 'time');
  at(1000, 'buffer');
  at(1500, 'play');
  at(1500, 'time');
  at(9000, 'complete');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 200, rebuffer_count: 1, rebuffer_ms: 500 });
  click(20000);
  at(20050, 'play');
  at(20050, 'time');
  expect(takePlayTiming('a.mp3')).toEqual({ start_trigger: 'user', click_to_play_ms: 50, rebuffer_count: 0, rebuffer_ms: 0 });
});
