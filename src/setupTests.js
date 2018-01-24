/* eslint-disable import/no-extraneous-dependencies */
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import 'jest-enzyme';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => setTimeout(cb, 0);

let shallowScreen;
export const shallowRender = (component, props) => {
  if (!shallowScreen) {
    shallowScreen = shallow(React.createElement(component, props));
  }
  return shallowScreen;
};

let mountedScreen;
export const mountedRender = (component, props) => {
  if (!mountedScreen) {
    mountedScreen = mount(React.createElement(component, props));
  }
  return mountedScreen;
};
