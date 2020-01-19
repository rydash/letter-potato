import React from 'react';
import { render } from '@testing-library/react';
import App from '.';

// TODO

test('renders Letter Potato header', () => {
  const { getByText } = render(<App />);
  const header = getByText(/letter potato/i);
  expect(header).toBeInTheDocument();
});
