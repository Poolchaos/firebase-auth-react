import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@testing-library/jest-dom';

import { store } from '../store';
import AppRoutes from '../routes';
import { loginSuccess } from '../features/auth/authSlice';

describe('Routing Tests', () => {
  test('renders Login page as default route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('navigates to Signup page', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/signup']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('navigates to Welcome page', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Welcome Page')).toBeInTheDocument();
  });

  test('navigates to Profile page', async () => {
    store.dispatch(
      loginSuccess({
        user: { id: '1', email: 'user@example.com' },
        token: 'fake-token',
      }),
    );

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Profile'));

    await waitFor(() => {
      expect(screen.getByText('Profile Page')).toBeInTheDocument();
    });
  });
});
