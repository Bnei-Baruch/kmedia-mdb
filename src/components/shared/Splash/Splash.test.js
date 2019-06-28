import 'jest-enzyme';

import { Header } from 'semantic-ui-react';

import SplashFixture from './__fixtures__/Splash.fixture';
import SplashWOSubtext from './__fixtures__/SplashWOSubtext.fixture';
import { mountedRender } from '../../../setupTests';

[SplashFixture, SplashWOSubtext].forEach((fixture) => {
  describe('Splash', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mountedRender(fixture.component, { ...fixture.props });
    });

    it('renders error', () => {
      const { text, subtext } = fixture.props;
      const message           = `${text}${subtext || ''}`;
      expect(wrapper).toHaveText(message);
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
  });
});
