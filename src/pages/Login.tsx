import React, { useState } from 'react';
import { login } from '../services/authService';
import { loginSuccess } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loader state

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const validateForm = (): boolean => {
    let isValid = true;

    setEmailError(null);
    setPasswordError(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setError(null);

    setIsLoading(true);

    try {
      const userCredential = await login(email, password);
      dispatch(
        loginSuccess({
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          },
          token: 'your_token',
        }),
      );
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('auth/invalid-credential') ||
          error.message.includes('INVALID_LOGIN_CREDENTIALS')
        ) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('auth/invalid-email')) {
          setError('The email address is not valid.');
        } else if (error.message.includes('auth/user-not-found')) {
          setError('No user found with this email.');
        } else if (error.message.includes('auth/wrong-password')) {
          setError('Incorrect password.');
        } else {
          setError('An unknown error occurred. Please try again later.');
        }
      }
    } finally {
      setIsLoading(false); // Stop loading after response
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        noValidate
        className="bg-white text-black p-8 rounded-lg shadow-lg w-full sm:w-96"
        aria-labelledby="login-form"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={emailError ? 'true' : 'false'}
            aria-describedby="email-error"
            autoComplete="email"
          />
          {emailError && (
            <p id="email-error" className="text-red-500 text-sm">
              {emailError}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={passwordError ? 'true' : 'false'}
            aria-describedby="password-error"
            autoComplete="current-password"
          />
          {passwordError && (
            <p id="password-error" className="text-red-500 text-sm">
              {passwordError}
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 border-white border-t-2 border-r-2 rounded-full"
                viewBox="0 0 24 24"
              ></svg>
              Logging in...
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
