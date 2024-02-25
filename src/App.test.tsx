import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

test('renders learn react link', () => {
  render(<App />);
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});
