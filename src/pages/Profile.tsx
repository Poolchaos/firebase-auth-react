import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updatePassword } from '../services/authService';
import { setLoading, setError } from '../features/auth/authSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      dispatch(setLoading(true));
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      alert('Password updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setError(error.message));
      }
      setPasswordError('Failed to update password');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center flex-col items-center min-h-screen">
      <h1 className="mb-4">Profile Page</h1>
      {user ? (
        <>
          <div>
            <h3>Email: {user.email}</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="mt-4">
            <div className="mb-4">
              <label className="block" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white p-2 mt-4"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </>
      ) : (
        <p>You need to be logged in to view this page.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Profile;
