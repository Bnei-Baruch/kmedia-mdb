import React from 'react';
import { cleanup, render } from '@testing-library/react';
import 'jest-enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Promoted from './Promoted';

afterEach(cleanup);

describe('Promoted', () => {

  it('renders empty div in case of error', () => {
    const { container } = render(<Promoted banner={{
      err: true
    }} />);
    expect(container.firstChild).toBeEmpty();
  });
  it('renders empty div in case of wip', () => {
    const { container } = render(<Promoted banner={{
      wip: true
    }} />);
    expect(container.firstChild).toBeEmpty();
  });
  it('renders div with &nbsp; in case of no-content', () => {
    const { getByTestId } = render(<Promoted banner={{
      data: {},
    }} />);
    expect(getByTestId('empty-content')).toBeTruthy();
  });
  it('In case content presents it renders link, image and header+sub-header', () => {
    const { getByText } = render(<Router><Promoted banner={{
      data: {
        'content': '\n\u003cfigure class="wp-block-image"\u003e\u003cimg src="http://localhost:8090/cms/assets/2019/06/111.jpg" alt="" class="wp-image-111"/\u003e\u003c/figure\u003e\n',
        'meta': [{ 'header': ['Header'] }, { 'sub-header': ['subHeader'] }, { 'link': ['/ru/simple-mode'] }]
      },
    }} /></Router>);
    expect(getByText('Header')).toBeTruthy();
    expect(getByText('subHeader')).toBeTruthy();
    // TODO: to check behaviour if link
  });

});
