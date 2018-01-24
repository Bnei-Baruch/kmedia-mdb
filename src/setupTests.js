/* eslint-disable import/no-extraneous-dependencies */
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import 'jest-enzyme';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => setTimeout(cb, 0);

export const shallowRender = (component, props) => {
  return shallow(React.createElement(component, props));
};

export const mountedRender = (component, props) => {
  return mount(React.createElement(component, props));
};
