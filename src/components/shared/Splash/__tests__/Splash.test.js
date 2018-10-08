import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-enzyme';

import { Header, Icon } from 'semantic-ui-react';

import SplashFixture from '../__fixtures__/Splash.fixture';
import SplashWOSubtext from '../__fixtures__/SplashWOSubtext.fixture';
import { mountedRender, shallowRender } from '../../../../setupTests';

import { ErrorSplash, FrownSplash, LoadingSplash, Splash } from '../Splash';

[SplashFixture, SplashWOSubtext].forEach((fixture) => {
  describe('Splash', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mountedRender(Splash, { ...fixture.props });
    });

    it('renders error', () => {
      const { text, subtext } = fixture.props;
      const message           = `${text}${subtext || ''}`;
      expect(wrapper).toHaveText(message);
    });

    it('always render exactly one Header', () => {
      const headers = wrapper.find(Header);
      expect(headers).toHaveLength(1);
    });

    describe('the rendered Header', () => {
      it('always renders an Icon', () => {
        const icons = wrapper.find(Icon);
        expect(icons).toExist();
      });

      it('Icon has proper params', () => {
        const icon                             = wrapper.find(Icon);
        const { color, icon: name, isLoading: loading } = fixture.props;
        expect(icon).toHaveProp({ color, name, loading });
      });

      it('always renders an Header.Content', () => {
        const header = wrapper.find(Header.Content);
        expect(header).toExist();
      });
    });

    describe('subtext', () => {

      if (typeof fixture.props.subtext === 'undefined') {
        describe('when subtext is not supplied', () => {
          it('does not render Header.Subheader', () => {
            const subheader = wrapper.find(Header.Subheader);
            expect(subheader).not.toExist();
          });
        });
      } else {
        describe('when subtext is supplied', () => {
          it('renders Header.Subheader', () => {
            const subheader = wrapper.find(Header.Subheader);
            expect(subheader).toExist();
          });
          it('renders Header.Subheader with this subtext', () => {
            const subheader = wrapper.find(Header.Subheader);
            expect(subheader).toHaveText(fixture.props.subtext);
          });
        });
      }
    });

    describe('Renders the same as the last time', () => {
      it('Matches snapshot', () => {
        const tree = renderer.create(wrapper).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
});

describe('LoadingSplash', () => {
  const text          = 'Still loading...';
  const loadingSplash = shallowRender(LoadingSplash, { text });
  const tree1         = renderer.create(loadingSplash).toJSON();

  it('renders correctly', () => {
    const splash = shallowRender(Splash, { isLoading: true, icon: 'circle notch', color: 'blue', text });
    const tree2  = renderer.create(splash).toJSON();
    expect(tree1).toEqual(tree2);
  });

  it('matches snapshot', () => {
    expect(tree1).toMatchSnapshot();
  });
});

describe('FrownSplash', () => {
  const text        = 'Still loading...';
  const frownSplash = shallowRender(FrownSplash, { text });
  const tree1       = renderer.create(frownSplash).toJSON();

  it('renders correctly', () => {
    const splash = shallowRender(Splash, { icon: 'frown', color: 'orange', text });
    const tree2  = renderer.create(splash).toJSON();
    expect(tree1).toEqual(tree2);
  });

  it('matches snapshot', () => {
    expect(tree1).toMatchSnapshot();
  });
});

describe('ErrorSplash', () => {
  const text        = 'Nasty error...';
  const errorSplash = shallowRender(ErrorSplash, { text });
  const tree1       = renderer.create(errorSplash).toJSON();

  it('renders correctly', () => {
    const splash = shallowRender(Splash, { icon: 'warning sign', color: 'red', text });
    const tree2  = renderer.create(splash).toJSON();
    expect(tree1).toEqual(tree2);
  });

  it('matches snapshot', () => {
    expect(tree1).toMatchSnapshot();
  });
});
