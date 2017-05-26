import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Kmedia from './components/kmedia';
import Layout from './components/layout';

describe('Kmedia Component', () => {
  it('should render without throwing an error', () => {
    expect(shallow(<Kmedia />).contains(<h3 className="ui header"></h3>)).toBe(true);
  });

  it('always renders a `Layout`', () => {
    expect(mount(<Layout />).find('.ui.header').length).toBe(1);
  });
});

