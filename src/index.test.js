import React from 'react';
import $ from 'teaspoon';

import Kmedia from './components/kmedia';
import Layout from './components/layout';

describe('Kmedia Component', () => {
  let renderedKmedia;
  const kmedia = () => {
    if (!renderedKmedia) {
      renderedKmedia = $(<Kmedia />).render();
    }
    return renderedKmedia;
  };

  beforeEach(() => {
    if (renderedKmedia) {
      renderedKmedia.unmount();
    }
    renderedKmedia = undefined;
  });

  describe('render', () => {
    const media = kmedia();

    media.tap(collection =>
      // renders without crashing
      expect(collection.length).toBe(1)
    );

    it('always renders a `Layout`', () => {
      expect(media.find(Layout).length).toBe(1);
    });

    it('does not receive any props', () => {
      expect(Object.keys(media.props()).length).toBe(0);
    });
  });
});

