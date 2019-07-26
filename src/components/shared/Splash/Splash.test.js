import React from 'react';
import { cleanup, render } from '@testing-library/react';
import 'jest-enzyme';

import { Splash } from './Splash';

afterEach(cleanup);

it('renders like ErrorSplash', () => {
  const text = 'Server Error', subtext = 'No response from server';

  const { getByText } = render(<Splash
    icon='warning sign'
    color='red'
    text={text}
    subtext={subtext}
    isLoading={false}
  />);
  expect(getByText(text)).toHaveClass('content');
  expect(getByText(subtext)).toHaveClass('sub header');
});

it('does not render Header.Subheader when subtext is not supplied', () => {
  const text = 'Server Error';

  const { getByText, queryByTestId } = render(<Splash
    icon='spinner'
    color='red'
    text={text}
    isLoading={true}
  />);
  expect(getByText(text)).toHaveClass('content');
  expect(queryByTestId('header.subHeader')).toBeNull();
});
