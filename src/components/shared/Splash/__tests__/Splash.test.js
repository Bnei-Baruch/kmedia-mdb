import { shallowToJson } from 'enzyme-to-json';

import { Header, Icon } from 'semantic-ui-react';

import createTestContext from 'react-cosmos-test/enzyme';

import SplashFixture from '../__fixtures__/Splash.fixture';
import SplashWOSubtext from '../__fixtures__/SplashWOSubtext.fixture';
import { shallowRender } from '../../../../setupTests';

import { ErrorSplash, FrownSplash, LoadingSplash, Splash } from '../Splash';

[SplashFixture, SplashWOSubtext].forEach((fixture) => {
  describe('Splash', () => {
    const { mount: mountFixture, getWrapper } = createTestContext({ fixture });
    let wrapper;
    beforeEach(mountFixture);
    beforeEach(() => {
      wrapper = getWrapper();
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
        const { color, icon: name, isLoading } = fixture.props;
        expect(icon).toHaveProp('color', color);
        expect(icon).toHaveProp('name', name);
        expect(icon).toHaveProp('loading', isLoading);
      });

      it('always renders an Header.Content', () => {
        const header = wrapper.find(Header.Content);
        expect(header).toExist();
        // it('Header.Content does not receive any props', () => {
        //   expect(Object.keys(header.props())).toBeEmpty();
        // });
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
      }

      if (typeof fixture.props.subtext !== 'undefined') {
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
        expect(shallowToJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});

describe('LoadingSplash', () => {
  const text = 'Still loading...';
  const icon = 'circle notch';
  const color = 'blue';

  it('renders correctly', () => {
    const loadingSplash = shallowRender(LoadingSplash, { text }).dive();
    const splash        = shallowRender(Splash, { color, icon, text, isLoading: true });
    expect(shallowToJson(loadingSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const loadingSplash = shallowRender(LoadingSplash, { text });
    expect(shallowToJson(loadingSplash)).toMatchSnapshot();
  });
});

describe('FrownSplash', () => {
  const text  = 'Still loading...';
  const icon  = 'frown';
  const color = 'orange';

  it('renders correctly', () => {
    const frownSplash = shallowRender(FrownSplash, { text }).dive();
    const splash      = shallowRender(Splash, { icon, color, text });
    expect(shallowToJson(frownSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const frownSplash = shallowRender(FrownSplash, { text });
    expect(shallowToJson(frownSplash)).toMatchSnapshot();
  });
});

describe('ErrorSplash', () => {
  const text  = 'Nasty error...';
  const icon  = 'warning sign';
  const color = 'red';

  it('renders correctly', () => {
    const errorSplash = shallowRender(ErrorSplash, { text }).dive();
    const splash      = shallowRender(Splash, { icon, color, text });
    expect(shallowToJson(errorSplash)).toEqual(shallowToJson(splash));
  });

  it('matches snapshot', () => {
    const errorSplash = shallowRender(ErrorSplash, { text });
    expect(shallowToJson(errorSplash)).toMatchSnapshot();
  });
});
