import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore, Store } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import Login from '../pages/Login';
import { RootState } from '../store';
import { login } from '../services/authService';

jest.mock('../services/authService', () => ({
  login: jest.fn(),
}));

const createTestStore = (): Store<RootState> => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithStore = (store: Store<RootState>) => {
  return render(
    <Provider store={store}>
      <Login />
    </Provider>,
  );
};

describe('Login Page', () => {
  afterEach(cleanup);

  test('dispatches login action on form submission', async () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    (login as jest.Mock).mockResolvedValue({
      user: { id: '1', email: 'user@example.com' },
    });

    renderWithStore(store);

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'flaap@zailab.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Test1234' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(
      () => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'auth/loginSuccess' }),
        );
      },
      { timeout: 3000 },
    );
  });

  test('shows validation errors for empty fields', async () => {
    renderWithStore(createTestStore());

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  test('shows error for invalid email format', async () => {
    const store = createTestStore();
    renderWithStore(store);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    expect(
      await screen.findByText(/Please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  test('shows error message for invalid credentials', async () => {
    (login as jest.Mock).mockRejectedValue(
      new Error('INVALID_LOGIN_CREDENTIALS'),
    );
    renderWithStore(createTestStore());

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(
        screen.getByText('Invalid email or password. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  test('does not dispatch action on invalid form submission', async () => {
    const store = createTestStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    renderWithStore(store);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
