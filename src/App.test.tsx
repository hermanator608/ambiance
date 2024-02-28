import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

jest.mock('firebase/auth');

test('renders App on the main ambaince page with logged in user', () => {
  (getAuth as jest.Mock).mockReturnValue({
      currentUser: {
        email: "testUser@gmail.com"
      }
  });

  (onAuthStateChanged as jest.Mock).mockReturnValue(jest.fn());

  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});

test('renders Main ambaince page with no user', () => {

});

// Need to setup browserrouter to go to /admin
test('renders Admin page with logged in user', () => {

});

// Need to setup browserrouter to go to /admin
test('renders Login page when going to admin page with no user', () => {

});
