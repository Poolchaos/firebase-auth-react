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
import Signup from '../pages/Signup';
import { signup } from '../services/authService';
import { RootState } from '../store';

jest.mock('../services/authService', () => ({
  signup: jest.fn(),
}));

const createTestStore = (): Store => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithStore = (store: Store<RootState>) => {
  return render(
    <Provider store={store}>
      <Signup />
    </Provider>,
  );
};

describe('Signup Page', () => {
  afterEach(cleanup);

  test('should submit form with valid data and redirect', async () => {
    const store = createTestStore();
    (signup as jest.Mock).mockResolvedValue({
      user: { uid: '1', email: 'test@example.com' },
    });

    renderWithStore(store);

    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter a strong password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the success message
    await waitFor(() => {
      expect(
        screen.getByText('Signup successful! Redirecting to login...'),
      ).toBeInTheDocument();
    });

    // Debugging
    screen.debug(); // Logs the DOM to help you debug
  });

  test('shows validation errors for empty fields', async () => {
    renderWithStore(createTestStore());

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(
      () => {
        expect(screen.getByText('Name is required.')).toBeInTheDocument();
        expect(
          screen.getByText('Please enter a valid email address.'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Password must be at least 6 characters long.'),
        ).toBeInTheDocument();
      },
      { timeout: 500 },
    );
  });

  test('shows error for invalid email format', async () => {
    renderWithStore(createTestStore());

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter a strong password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address.'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message when signup fails', async () => {
    (signup as jest.Mock).mockRejectedValue(
      new Error('Signup failed. Please try again.'),
    );
    renderWithStore(createTestStore());

    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter a strong password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Signup failed. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  test('disables form elements after successful signup', async () => {
    (signup as jest.Mock).mockResolvedValue({
      user: { uid: '1', email: 'test@example.com' },
    });
    renderWithStore(createTestStore());

    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter a strong password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm your password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Signup successful! Redirecting to login...'),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText(
      'Enter a strong password',
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password',
    );

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
  });
});
