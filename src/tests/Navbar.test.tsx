import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';

import Navbar from '../components/Navbar';
import authReducer, {
  loginFailure,
  setError,
  setLoading,
} from '../features/auth/authSlice';
import { loginSuccess } from '../features/auth/authSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  initialEntries?: string[],
) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries || ['/']}>
          {ui}
        </MemoryRouter>
      </Provider>,
    ),
    store,
  };
};

describe('Navbar', () => {
  afterEach(cleanup);

  test('renders Login and Signup when not authenticated', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('renders Profile and Logout when authenticated', () => {
    const { store } = renderWithProviders(<Navbar />);

    act(() => {
      store.dispatch(
        loginSuccess({
          user: { id: '1', email: 'user@example.com' },
          token: 'fake-token',
        }),
      );
    });

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('logs out when Logout button is clicked', async () => {
    const { store } = renderWithProviders(<Navbar />);

    act(() => {
      store.dispatch(
        loginSuccess({
          user: { id: '1', email: 'user@example.com' },
          token: 'fake-token',
        }),
      );
    });

    const logoutButton = screen.getByText('Logout');

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  test('handles login failure', () => {
    const store = createTestStore();
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );
    store.dispatch(loginFailure({ error: 'Invalid credentials' }));
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.error).toBe('Invalid credentials');
  });

  test('sets loading state', () => {
    const store = createTestStore();
    store.dispatch(setLoading(true));
    expect(store.getState().auth.loading).toBe(true);
  });

  test('sets error state', () => {
    const store = createTestStore();
    store.dispatch(setError('Network error'));
    expect(store.getState().auth.error).toBe('Network error');
  });

  test('renders Navbar within a route', () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Navbar />} />
      </Routes>,
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
