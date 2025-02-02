import React, { useState } from 'react';
import { signup } from '../services/authService';

const Signup: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<
    string | null
  >(null);

  const validateForm = (): boolean => {
    let isValid = true;

    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signup(email, password, name);

      setSignupSuccessMessage('Signup successful! Redirecting to login...');
      setError(null);

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        noValidate
        className="bg-white text-black p-8 rounded-lg shadow-lg w-full sm:w-96"
        aria-labelledby="signup-form"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={nameError ? 'true' : 'false'}
            autoComplete="off"
            disabled={!!signupSuccessMessage}
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

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
            autoComplete="off"
            disabled={!!signupSuccessMessage}
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        <div className="mb-4">
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
            placeholder="Enter a strong password"
            className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={passwordError ? 'true' : 'false'}
            autoComplete="off"
            disabled={!!signupSuccessMessage}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirm-password"
            className="block text-gray-700 font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full bg-white p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-invalid={confirmPasswordError ? 'true' : 'false'}
            autoComplete="off"
            disabled={!!signupSuccessMessage}
          />
          {confirmPasswordError && (
            <p className="text-red-500 text-sm">{confirmPasswordError}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {signupSuccessMessage && (
          <p className="text-green-500 text-sm text-center mb-4">
            {signupSuccessMessage}
          </p>
        )}

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
              Signing up...
            </div>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
