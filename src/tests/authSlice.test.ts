import authReducer, {
  loginSuccess,
  loginFailure,
  logout,
  setLoading,
  setError,
  authenticateUser,
  signupUser,
  logoutUser,
  signupSuccess,
} from '../features/auth/authSlice';
import {
  login,
  signup,
  logout as firebaseLogout,
} from '../services/authService';
import { AppDispatch } from '../store';

jest.mock('../services/authService', () => ({
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
}));

describe('authSlice', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  it('should handle loginSuccess', () => {
    const user = { id: '1', email: 'test@example.com' };
    const token = 'test-token';
    const action = loginSuccess({ user, token });
    const newState = authReducer(initialState, action);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(user);
    expect(newState.token).toBe(token);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('should handle loginFailure', () => {
    const error = 'Invalid credentials';
    const action = loginFailure({ error });
    const newState = authReducer(initialState, action);
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(error);
  });

  it('should handle logout', () => {
    const stateWithUser = {
      ...initialState,
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com' },
      token: 'test-token',
    };
    const action = logout();
    const newState = authReducer(stateWithUser, action);
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('should handle setLoading', () => {
    const action = setLoading(true);
    const newState = authReducer(initialState, action);
    expect(newState.loading).toBe(true);
  });

  it('should handle setError', () => {
    const error = 'Network error';
    const action = setError(error);
    const newState = authReducer(initialState, action);
    expect(newState.error).toBe(error);
  });

  describe('Thunks', () => {
    it('should handle authenticateUser (login)', async () => {
      const mockUser = {
        uid: '1',
        email: 'test@example.com',
        getIdToken: jest.fn(() => Promise.resolve('test-token')),
      };
      const userCredential = { user: mockUser };
      (login as jest.Mock).mockResolvedValue(userCredential);

      const dispatch: AppDispatch = jest.fn();
      await authenticateUser('test@example.com', 'password')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(
        loginSuccess({
          user: { id: '1', email: 'test@example.com' },
          token: 'test-token',
        }),
      );
      expect(mockUser.getIdToken).toHaveBeenCalled();
    });

    it('should handle authenticateUser (login) error', async () => {
      const error = new Error('Invalid credentials');
      (login as jest.Mock).mockRejectedValue(error);

      const dispatch: AppDispatch = jest.fn();
      await authenticateUser('test@example.com', 'password')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(
        loginFailure({ error: error.message }),
      );
    });

    it('should handle signupUser', async () => {
      const mockUser = {
        uid: '1',
        email: 'test@example.com',
        getIdToken: jest.fn(() => Promise.resolve('test-token')),
      };
      const userCredential = { user: mockUser };
      (signup as jest.Mock).mockResolvedValue(userCredential);

      const dispatch: AppDispatch = jest.fn();
      await signupUser('test@example.com', 'password')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(signupSuccess());
    });

    it('should handle signupUser error', async () => {
      const error = new Error('Signup failed');
      (signup as jest.Mock).mockRejectedValue(error);

      const dispatch: AppDispatch = jest.fn();
      await signupUser('test@example.com', 'password')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setLoading(true));
      expect(dispatch).toHaveBeenCalledWith(
        loginFailure({ error: error.message }),
      );
    });

    it('should handle logoutUser', async () => {
      (firebaseLogout as jest.Mock).mockResolvedValue(null);
      const dispatch: AppDispatch = jest.fn();
      await logoutUser()(dispatch);

      expect(firebaseLogout).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(logout());
    });

    it('should handle logoutUser error', async () => {
      const error = new Error('Logout failed');
      (firebaseLogout as jest.Mock).mockRejectedValue(error);
      const dispatch: AppDispatch = jest.fn();
      await logoutUser()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setError(error.message));
    });
  });
});
