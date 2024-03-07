import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
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
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});

test('renders Main ambaince page with no user', () => {
  (getAuth as jest.Mock).mockReturnValue({
    currentUser: null
  });
  (onAuthStateChanged as jest.Mock).mockReturnValue(jest.fn());

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});

// Need to setup browserrouter to go to /admin
test('renders Admin page with logged in user', () => {
  (getAuth as jest.Mock).mockReturnValue({
    currentUser: {
      email: "testUser@gmail.com"
    }
  });
  (onAuthStateChanged as jest.Mock).mockReturnValue(jest.fn());

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('admin')
  expect(mainEl).toBeInTheDocument();
});

// Need to setup browserrouter to go to /admin
test('renders Login page spinner when going to admin page with undefined user', () => {
  (getAuth as jest.Mock).mockReturnValue({
    currentUser: undefined
  });
  (onAuthStateChanged as jest.Mock).mockReturnValue(jest.fn());

  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('login-spinner')
  expect(mainEl).toBeInTheDocument();
});
