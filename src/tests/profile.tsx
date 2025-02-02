import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Profile from '../pages/Profile';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { updatePassword } from '../services/authService';
import '@testing-library/jest-dom';

jest.mock('../services/authService', () => ({
  updatePassword: jest.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('Profile Page', () => {
  test('should show user email and allow password update', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );

    // Mock user info in the store
    store.dispatch({
      type: 'auth/loginSuccess',
      payload: { user: { email: 'test@example.com' }, token: 'test-token' },
    });

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'newPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    (updatePassword as jest.Mock).mockResolvedValue(undefined);

    await waitFor(() => {
      expect(
        screen.getByText('Password updated successfully!'),
      ).toBeInTheDocument();
    });
  });

  test('should show error if passwords do not match', () => {
    render(
      <Provider store={createTestStore()}>
        <Profile />
      </Provider>,
    );

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: 'differentPassword123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
