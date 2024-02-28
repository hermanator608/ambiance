import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { Routes } from "react-router-dom";

test('renders learn react link', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <App />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});
