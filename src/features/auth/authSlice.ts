import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signOut } from 'firebase/auth';
import { AppDispatch } from '../../store';
import { login, signup } from '../../services/authService';
import { auth } from '../../firebaseConfig';

interface User {
  id: string;
  email: string | null;
  name?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = 'some-token';
      state.loading = false;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload.error;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setRehydratedState: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
  },
});

export const {
  loginSuccess,
  signupSuccess,
  loginFailure,
  logout,
  setLoading,
  setError,
  setRehydratedState,
} = authSlice.actions;

export const authenticateUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const userCredential = await login(email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      dispatch(
        loginSuccess({ user: { id: user.uid, email: user.email }, token }),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(loginFailure({ error: error.message }));
      } else {
        dispatch(loginFailure({ error: 'An unknown error occurred' }));
      }
    }
  };

export const signupUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      await signup(email, password);

      dispatch(signupSuccess());
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(loginFailure({ error: error.message }));
      } else {
        dispatch(loginFailure({ error: 'An unknown error occurred' }));
      }
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(setError(error.message));
    } else {
      dispatch(setError('An unknown error occurred'));
    }
  }
};

export default authSlice.reducer;
