import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'react-testing-library/cleanup-after-each';
import 'jest-enzyme';
// import 'jest-axe/extend-expect'; // Testing the a11y
import 'jest-dom/extend-expect'; // adds custom jest matchers from jest-dom

import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => setTimeout(cb, 0);

export const shallowRender = (component, props) => shallow(React.createElement(component, props));

export const mountedRender = (component, props) => mount(React.createElement(component, props));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the withNamespaces HoC receive the t function as a prop
  withNamespaces: () => (c) => {
    c.defaultProps = { ...c.defaultProps, t: k => k };
    return c;
  },
}));

export function mountWrapRouter(node) {
  return mount(<Router>{node}</Router>);
}

export function shallowWrapRouter(node) {
  return shallow(<Router>{node}</Router>);
}

