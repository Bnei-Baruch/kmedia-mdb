import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallowToJson } from 'enzyme-to-json';

import { Header, Icon } from 'semantic-ui-react';

import { Splash } from './Splash';

configure({ adapter: new Adapter() });

describe('Splash', () => {
  const shallowSplashRender = props => shallow(<Splash {...props} />);
  const mountedSplashRender = props => mount(<Splash {...props} />);

  let shallowLockScreen;
  const shallowSplash = (props) => {
    if (!shallowLockScreen) {
      shallowLockScreen = shallowSplashRender(props);
    }
    return shallowLockScreen;
  };
  let mountedLockScreen;
  const mountedSplash = (props) => {
    if (!mountedLockScreen) {
      mountedLockScreen = mountedSplashRender(props);
    }
    return mountedLockScreen;
  };

  it('should render correctly', () => {
    const output = shallowSplash({ icon: 'spinner', text: 'Still loading...' });
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('always render a Header', () => {
    const headers = shallowSplash({ icon: '', text: '' }).find(Header);
    expect(headers.length).toBeGreaterThan(0);
  });

  describe('the rendered Header', () => {
    it('contains everything else that gets rendered', () => {
      const headers = shallowSplash({ icon: '', text: '' }).find(Header);

      // When using .find, enzyme arranges the nodes in order such
      // that the outermost node is first in the list. So we can
      // use .first() to get the outermost div.
      const wrappingHeader = headers.first();

      // Enzyme omits the outermost node when using the .children()
      // method on splash(). This is annoying, but we can use it
      // to verify that wrappingHeader contains everything else this
      // component renders.
      expect(wrappingHeader.children()).toEqual(shallowSplash({ icon: '', text: '' }).children());
    });

    it('always renders an Icon', () => {
      expect(shallowSplash({ icon: '', text: '' }).find(Icon)).toHaveLength(1);
    });

    it('always renders an Header.Content', () => {
      const header = shallowSplash({ icon: '', text: '' }).find(Header.Content);
      expect(header).toHaveLength(1);
      it('Header.Content does not receive any props', () => {
        expect(Object.keys(header.props())).toHaveLength(0);
      });
    });
  });

  describe('when subtext is not supplied', () => {
    it('does not renders Header.Subheader', () => {
      const subheader = shallowSplash({ icon: '', text: '', subtext: 'subtext prop' }).find(Header.Subheader);
      expect(subheader).toHaveLength(0);
    });
  });

  describe('when subtext is supplied', () => {
    let subheader;
    const subtext = 'subtext prop';

    beforeEach(() => {
      subheader = mountedSplash({ icon: '', text: '', subtext }).find(Header.Subheader).first();
    });

    it('renders Header.Subheader', () => {
      expect(subheader).toHaveLength(1);
    });
    it('renders Header.Subheader with this subtext', () => {
      expect(subheader.props().children).toBe(subtext);
    });
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
