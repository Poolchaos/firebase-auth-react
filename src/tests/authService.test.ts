import { signup, login, logout } from '../services/authService';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

jest.mock('firebase/auth', () => {
  const mockAuth = {
    signInWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    ),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } }),
    ),
    signOut: jest.fn(() => Promise.resolve()),
  };

  return {
    getAuth: jest.fn(() => mockAuth),
    signInWithEmailAndPassword: jest.fn(
      () => mockAuth.signInWithEmailAndPassword,
    ),
    createUserWithEmailAndPassword: jest.fn(
      () => mockAuth.createUserWithEmailAndPassword,
    ),
    signOut: jest.fn(() => mockAuth.signOut),
  };
});

describe('authService', () => {
  it('should handle signup', async () => {
    const mockUserCredential = {
      user: { uid: '1', email: 'test@example.com' },
    };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential,
    );

    const userCredential = await signup('test@example.com', 'password');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password',
    );
    expect(userCredential).toEqual(mockUserCredential);
  });

  it('should handle signup error', async () => {
    const error = new Error('Signup failed');
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(signup('test@example.com', 'password')).rejects.toThrow(
      error.message,
    );
  });

  it('should handle login', async () => {
    const mockUserCredential = {
      user: { uid: '1', email: 'test@example.com' },
    };
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential,
    );

    const userCredential = await login('test@example.com', 'password');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password',
    );
    expect(userCredential).toEqual(mockUserCredential);
  });

  it('should handle login error (invalid credentials)', async () => {
    const error = new Error('INVALID_LOGIN_CREDENTIALS');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'Invalid email or password. Please try again.',
    );
  });

  it('should handle login error (invalid email)', async () => {
    const error = new Error('auth/invalid-email');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'The email address is not valid.',
    );
  });

  it('should handle login error (user not found)', async () => {
    const error = new Error('auth/user-not-found');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'No user found with this email.',
    );
  });

  it('should handle login error (wrong password)', async () => {
    const error = new Error('auth/wrong-password');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'Incorrect password.',
    );
  });

  it('should handle login error (other Firebase error)', async () => {
    const error = new Error('Some other Firebase error');
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      error.message,
    );
  });

  it('should handle login error (unknown error)', async () => {
    const error = 'Some unknown error';
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

    await expect(login('test@example.com', 'password')).rejects.toThrow(
      'An unknown error occurred.',
    );
  });

  it('should handle logout', async () => {
    (signOut as jest.Mock).mockResolvedValue(null);
    await logout();
    expect(signOut).toHaveBeenCalled();
  });

  it('should handle logout error', async () => {
    const error = new Error('Logout failed');
    (signOut as jest.Mock).mockRejectedValue(error);
    await expect(logout()).rejects.toThrow(error.message);
  });

  it('should handle logout error (unknown error)', async () => {
    const error = 'Some unknown error';
    (signOut as jest.Mock).mockRejectedValue(error);
    await expect(logout()).rejects.toThrow('An unknown error occurred');
  });
});
