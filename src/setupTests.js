/* eslint-disable import/no-extraneous-dependencies */
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'jest-enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => setTimeout(cb, 0);

export const shallowRender = (component, props) =>
  shallow(React.createElement(component, props));

export const mountedRender = (component, props) =>
  mount(React.createElement(component, props));

const router = {
  history: new Router().history,
  route: {
    location: {},
    match: {}
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: PropTypes.shape({}) },
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => (c) => {
    // eslint-disable-next-line no-param-reassign
    c.defaultProps = { ...c.defaultProps, t: k => k };
    return c;
  },
}));

export function mountWrapRouter(node) {
  return mount(node, createContext());
}

export function shallowWrapRouter(node) {
  return shallow(node, createContext());
}
