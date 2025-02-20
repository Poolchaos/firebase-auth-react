import { logout, setError } from '../features/auth/authSlice';
import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { AppDispatch } from '../store';

export const signup = async (
  email: string,
  password: string,
  name?: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
    }

    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.message.includes('auth/invalid-email')) {
        throw new Error('The email address is not valid.');
      } else if (error.message.includes('auth/user-not-found')) {
        throw new Error('No user found with this email.');
      } else if (error.message.includes('auth/wrong-password')) {
        throw new Error('Incorrect password.');
      } else {
        throw new Error(error.message);
      }
    } else {
      throw new Error('An unknown error occurred.');
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

export const updatePassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is logged in');

    await firebaseUpdatePassword(user, newPassword);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
