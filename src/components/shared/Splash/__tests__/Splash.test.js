import React from 'react';
import { shallowToJson } from 'enzyme-to-json';

import { Header, Icon } from 'semantic-ui-react';

import createTestContext from 'react-cosmos-test/enzyme';

import SplashFixture from './__fixtures__/Splash.fixture';
import SplashWOSubtext from './__fixtures__/SplashWOSubtext.fixture';
import { Init, shallowRender } from './../../../helpers/tests/test-utils';

import { ErrorSplash, FrownSplash, LoadingSplash, Splash } from './Splash';

Init();

[SplashFixture, SplashWOSubtext].forEach((fixture) => {
  describe('Splash', () => {
    const { mount: mountFixture, getWrapper } = createTestContext({ fixture });

    beforeEach(mountFixture);

    it('renders error', () => {
      const { text, subtext } = fixture.props;
      const message           = `${text}${subtext || ''}`;
      expect(getWrapper().text()).toBe(message);
    });

    it('always render exactly one Header', () => {
      const headers = getWrapper().find(Header);
      expect(headers).toHaveLength(1);
    });

    describe('the rendered Header', () => {
      it('always renders an Icon', () => {
        const icons = getWrapper().find(Icon);
        expect(icons).toHaveLength(1);
      });

      it('Icon has proper params', () => {
        const icon                                                = getWrapper().find(Icon);
        const { color: iColor, name: iIcon, loading: iLoading }   = icon.props();
        const { color: fColor, icon: fIcon, isLoading: fLoading } = fixture.props;
        expect({
          color: fColor,
          icon: fIcon,
          isLoading: fLoading,
        }).toEqual({
          color: iColor,
          icon: iIcon,
          isLoading: iLoading,
        });
      });

      it('always renders an Header.Content', () => {
        const header = getWrapper().find(Header.Content);
        expect(header).toHaveLength(1);
        it('Header.Content does not receive any props', () => {
          expect(Object.keys(header.props())).toHaveLength(0);
        });
      });
    });

    describe('subtext', () => {
      if (typeof fixture.props.subtext === 'undefined') {
        describe('when subtext is not supplied', () => {
          it('does not render Header.Subheader', () => {
            const subheader = getWrapper().find(Header.Subheader);
            expect(subheader).toHaveLength(0);
          });
        });
      }

      if (typeof fixture.props.subtext !== 'undefined') {
        describe('when subtext is supplied', () => {
          it('renders Header.Subheader', () => {
            const subheader = getWrapper().find(Header.Subheader);
            expect(subheader).toHaveLength(1);
          });
          it('renders Header.Subheader with this subtext', () => {
            const subheader = getWrapper().find(Header.Subheader);
            expect(subheader.text()).toBe(fixture.props.subtext);
          });
        });
      }
    });

    describe('Renders the same as the last time', () => {
      it('Matches snapshot', () => {
        expect(shallowToJson(getWrapper())).toMatchSnapshot();
      });
    });
  });
});

describe('LoadingSplash', () => {
  it('renders correctly', () => {
    const loadingSplash = shallowRender(LoadingSplash, { text: 'Still loading...' });
    const splash        = shallowRender(Splash, { icon: 'spinner', text: 'Still loading...' });
    expect(shallowToJson(loadingSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const loadingSplash = shallowRender(LoadingSplash, { text: 'Still loading...' });
    expect(shallowToJson(loadingSplash)).toMatchSnapshot();
  });
});

describe('FrownSplash', () => {
  it('renders correctly', () => {
    const text        = 'Still loading...';
    const frownSplash = shallowRender(FrownSplash, { text });
    const splash      = shallowRender(Splash, { icon: 'frown', color: 'orange', text });
    expect(shallowToJson(frownSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const frownSplash = shallowRender(FrownSplash, { text: 'Still loading...' });
    expect(shallowToJson(frownSplash)).toMatchSnapshot();
  });
});

describe('ErrorSplash', () => {
  it('renders correctly', () => {
    const errorSplash = shallowRender(ErrorSplash, { text: 'Still loading...' });
    const splash      = shallowRender(Splash, { icon: 'warning sign', color: 'red', text: 'Still loading...' });
    expect(shallowToJson(errorSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const errorSplash = shallowRender(ErrorSplash, { text: 'Still loading...' });
    expect(shallowToJson(errorSplash)).toMatchSnapshot();
  });
});
