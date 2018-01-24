import React from 'react';

describe('basic', () => {
  beforeEach(() => {
    console.log('!!!');
  });

  it('shallow renders without crashing', () => {
    expect(1).toBe(1);
  });
});

// https://medium.freecodecamp.org/the-right-way-to-test-react-components-548a4736ab22
//
// The concerns of React component:
// * What do I do with the props I receive?
// * What components do I render? What do I pass to those components?
// * Do I ever keep anything in state? If so, do I invalidate it when receiving new props? When do I update state?
// * If a user interacts with me or a child component calls a callback I passed to it, what do I do?
// * Does anything happen when I’m mounted? When I’m unmounted?
//
// Should we test?
// * Will the test have to duplicate exactly the application code? This will make it brittle.
// * Will making assertions in the test duplicate any behavior that is already covered by (and the responsibility of) library code?
// * From an outsider’s perspective, is this detail important, or is it only an internal concern?
//   Can the effect of this internal detail be described using only the component’s public API?

// Articles
// https://nerdblog.pl/post/166842840969/testing-react-components

// Tools
// https://facebook.github.io/jest/
// https://github.com/airbnb/enzyme/
// https://github.com/airbnb/enzyme-matchers/ -- Jest assertions for enzyme
// http://sinonjs.org/ -- spies, stubs and mocks, sandbox
// https://cheerio.js.org/ -- enzyme wrapper for Static HTML rendering
// https://github.com/ctimmerm/axios-mock-adapter -- Stubbing network requests

// https://github.com/cypress-io/cypress -- system (in browser) tests
// https://github.com/react-cosmos/react-cosmos
// https://github.com/skidding/async-until -- wait until callback returns true

// Types of component tests
// * Snapshot tests (jest)
// * Rendering tests (enzyme/shallow; cosmos)
// * Behaviour tests (sinon)
// * Integration tests (enzyme/mount)
// * System tests (https://www.cypress.io/; jest-str -- jest system test runner, https://github.com/segmentio/nightmare; http://nightwatchjs.org/)
