import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export const signup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
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

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};
