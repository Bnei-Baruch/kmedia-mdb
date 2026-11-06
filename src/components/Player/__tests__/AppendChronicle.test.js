import React from 'react';
import { render } from '@testing-library/react';

import AppendChronicle from '../AppendChronicle';
import { ClientChroniclesContext } from '../../../helpers/app-contexts';

let mockState;
jest.mock('react-redux', () => ({ ...jest.requireActual('react-redux'), useSelector: selector => selector(mockState) }));
jest.mock('../../../redux/selectors', () => ({
  chroniclesGetEventSelector: s => s.event,
  playerGetFileSelector     : s => s.file,
  playlistGetPlayedSelector : s => s.item,
  playlistGetInfoSelector   : () => ({ isSingleMedia: false }),
  playerIsReadySelector     : s => s.ready
}));
jest.mock('../../../pkg/jwpAdapter/adapter', () => ({
  getDuration   : () => 0,
  getMute       : () => false,
  takePlayTiming: (src, late) => ({ start_trigger: late ? 'late' : 'on time' })
}));
jest.mock('../helper', () => ({ getSavedTime: () => 0 }));

const A = { id: 'a', src: 'https://cdn/a.mp4', name: 'a.mp4', type: 'video' };
const B = { id: 'b', src: 'https://cdn/b.mp3', name: 'b.mp3', type: 'audio' };

let appends, rerender;
const chronicles = { append: (ev, data) => appends.push(`${ev} ${data.file_uid}${ev === 'player-stop' ? ` ${data.start_trigger}` : ''}`) };
const ui         = () => <ClientChroniclesContext.Provider value={chronicles}><AppendChronicle /></ClientChroniclesContext.Provider>;
const step       = s => {
  Object.assign(mockState, s);
  rerender(ui());
};

beforeEach(() => {
  appends   = [];
  mockState = { event: null, file: A, item: { id: 'u' }, ready: true };
  ({ rerender } = render(ui()));
});

test('a same-path file switch (JWP destroyPlugin, player not ready) still stops the open play, once', () => {
  step({ event: 'player-play' });
  step({ event: 'player-stop', ready: false, file: B });   // destroyPlugin -> playerRemove, then setFile(B)
  step({ event: 'player-play', ready: true });
  step({ event: 'player-stop' });
  expect(appends).toEqual(['player-play a', 'player-stop a late', 'player-play b', 'player-stop b on time']);
});

test('a same-path file switch with no play after it (e.g. autoplay blocked) stops the open play at the switch', () => {
  step({ event: 'player-play' });
  step({ event: 'player-stop', ready: false, file: B });
  expect(appends).toEqual(['player-play a', 'player-stop a late']);
});

test('a path change stops the play once (pauseOnLeave, then destroyPlugin)', () => {
  step({ event: 'player-play' });
  step({ event: 'player-stop' });                          // pauseOnLeave
  step({ ready: false, file: B });                         // destroyPlugin's stop: event unchanged; new file
  step({ event: 'player-play', ready: true });
  expect(appends).toEqual(['player-play a', 'player-stop a on time', 'player-play b']);
});

test('a stop without a play is dropped; a play whose stop was lost is stopped before the next play', () => {
  step({ event: 'player-stop' });                          // e.g. the page's own pause before anything played
  step({ event: 'player-play' });
  step({ event: 'player-stop', ready: false });            // lost: player not ready
  step({ event: 'player-play', ready: true });             // same file plays again
  expect(appends).toEqual(['player-play a', 'player-stop a late', 'player-play a']);
});
