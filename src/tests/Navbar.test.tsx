import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';

import { store } from '../store';
import Navbar from '../components/Navbar';
import {
  loginSuccess,
  loginFailure,
  setLoading,
  setError,
} from '../features/auth/authSlice';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );
};

describe('Navbar', () => {
  test('renders Login and Signup when not authenticated', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('renders Profile and Logout when authenticated', () => {
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('logs out when Logout button is clicked', () => {
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByText('Logout'));
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  test('handles login failure', () => {
    store.dispatch(loginFailure({ error: 'Invalid credentials' }));
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.error).toBe('Invalid credentials');
  });

  test('sets loading state', () => {
    store.dispatch(setLoading(true));
    expect(store.getState().auth.loading).toBe(true);
  });

  test('sets error state', () => {
    store.dispatch(setError('Network error'));
    expect(store.getState().auth.error).toBe('Network error');
  });
});
