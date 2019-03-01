/* eslint-disable import/no-extraneous-dependencies */
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'jest-enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => setTimeout(cb, 0);

export const shallowRender = (component, props) => shallow(React.createElement(component, props));

export const mountedRender = (component, props) => mount(React.createElement(component, props));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the withNamespaces HoC receive the t function as a prop
  withNamespaces: () => (c) => {
    // eslint-disable-next-line no-param-reassign
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
