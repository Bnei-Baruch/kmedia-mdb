import React from 'react';

// Enzyme
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

// Testing library
import '@testing-library/jest-dom/extend-expect'; // adds custom jest matchers from jest-dom
// import 'jest-axe/extend-expect'; // Testing the a11y

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

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

export function mountWrapRouter(node) {
  return mount(<Router>{node}</Router>);
}

export function shallowWrapRouter(node) {
  return shallow(<Router>{node}</Router>);
}
