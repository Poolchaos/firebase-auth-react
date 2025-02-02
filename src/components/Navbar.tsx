import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../features/auth/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector<RootState, boolean>(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <nav className="p-4 bg-gray-800 flex justify-between">
      <div>
        <Link to="/" className="text-white mr-4">
          Home
        </Link>

        {isAuthenticated && <Link to="/profile">Profile</Link>}
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => dispatch(logout())}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Logout
        </button>
      ) : (
        <div>
          <Link to="/login" className="bg-white px-4 py-2 rounded mr-2">
            Login
          </Link>

          <Link to="/signup" className="bg-white px-4 py-2 rounded mx-2">
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
