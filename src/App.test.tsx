import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';


test('renders learn react link', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});
