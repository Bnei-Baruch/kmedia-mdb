import React from 'react';
import { cleanup, render } from '@testing-library/react';
import 'jest-enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

import Promoted from './Promoted';

afterEach(cleanup);

describe('Promoted', () => {

  it('renders empty div when there is no banner', () => {
    const { container } = render(<Promoted banner={null} />);
    expect(container.firstChild).toHaveClass('thumbnail');
    expect(container.firstChild).toBeEmptyDOMElement();
  });
  it('renders div with &nbsp; in case of error', () => {
    const { container } = render(<Promoted banner={{
      err: true
    }} />);
    expect(container.firstChild.textContent).toEqual(' ');
  });
  it('renders div with &nbsp; in case of wip', () => {
    const { container } = render(<Promoted banner={{
      wip: true
    }} />);
    expect(container.firstChild.textContent).toEqual(' ');
  });
  it('In case content presents it renders link, image and header+sub-header', () => {
    const { container, getByText } = render(<Router><Promoted banner={{
      meta: {
        header: 'Header',
        'sub-header': 'subHeader',
        link: '/ru/simple-mode',
        image: '2019/06/111.jpg',
      },
    }} /></Router>);
    expect(getByText('Header')).toBeTruthy();
    expect(getByText('subHeader')).toBeTruthy();
    expect(container.querySelector('a')).toHaveAttribute('href', '/ru/simple-mode');
    expect(container.querySelector('img.thumbnail__image')).toBeTruthy();
  });
  it('opens external link in a new tab', () => {
    const { container } = render(<Promoted banner={{
      meta: {
        header: 'Header',
        link: 'https://example.com/page',
        image: 'https://example.com/image.jpg',
      },
    }} />);
    const a = container.querySelector('a');
    expect(a).toHaveAttribute('href', 'https://example.com/page');
    expect(a).toHaveAttribute('target', '_blank');
  });

});
