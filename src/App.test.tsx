import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { vi } from 'vitest';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  deleteDoc: vi.fn(() => Promise.resolve()),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  getFirestore: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
}));

test('renders App on the main ambaince page with logged in user', () => {
  (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      currentUser: {
        email: "testUser@gmail.com"
      }
  });
  (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('main')
  expect(mainEl).toBeInTheDocument();
});

test('renders Main ambaince page with no user', () => {
  (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    currentUser: null
  });
  (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

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
  (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    currentUser: {
      email: "testUser@gmail.com"
    }
  });
  (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

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
  (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    currentUser: undefined
  });
  (onAuthStateChanged as unknown as ReturnType<typeof vi.fn>).mockReturnValue(vi.fn());

  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <App />
    </MemoryRouter>
  );
  const mainEl = screen.getByTestId('login-spinner')
  expect(mainEl).toBeInTheDocument();
});
