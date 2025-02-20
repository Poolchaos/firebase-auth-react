import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { loginSuccess, logout } from '../features/auth/authSlice';
import { store } from '../store';
import { act } from 'react';

const renderWithProviders = (
  ui: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries || ['/profile']}>
        {ui}
      </MemoryRouter>{' '}
    </Provider>,
  );
};

describe('ProtectedRoute', () => {
  test('redirects to login if not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<div>Profile</div>} />
        </Route>
      </Routes>,
      ['/profile'],
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders the component if authenticated', () => {
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<div>Profile</div>} />
        </Route>
      </Routes>,
      ['/profile'],
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('redirects to login after logout', async () => {
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/profile" element={<ProtectedRoute />}>
          <Route index element={<div>Profile</div>} />
        </Route>
      </Routes>,
      ['/profile'],
    );

    act(() => {
      store.dispatch(logout());
    });

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});
