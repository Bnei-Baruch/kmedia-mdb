import React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import { configure } from 'enzyme/build/index';

configure({ adapter: new Adapter() });

describe('basic', () => {
  beforeEach(() => {
    console.log('!!!');
  });

  it('shallow renders without crashing', () => {
    expect(1).toBe(1);
  });
});
