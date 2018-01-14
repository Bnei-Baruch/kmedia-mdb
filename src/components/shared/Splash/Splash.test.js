import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallowToJson } from 'enzyme-to-json';

import { Header, Icon } from 'semantic-ui-react';

import createTestContext from 'react-cosmos-test/enzyme';

import SplashFixture from './__fixtures__/Splash.fixture';
import SplashWOSubtext from './__fixtures__/SplashWOSubtext.fixture';

global.requestAnimationFrame = cb => setTimeout(cb, 0);

configure({ adapter: new Adapter() });

[SplashFixture, SplashWOSubtext].forEach((fixture) => {
  describe('Splash', () => {
    const { mount, getWrapper } = createTestContext({ fixture });

    beforeEach(mount);

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
