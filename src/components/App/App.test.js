import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';

describe('basic', () => {
  it('shallow renders without crashing', () => {
    shallow(<App />);
  });

  it('mounts without crashing', () => {
    mount(<App />);
  });
});
