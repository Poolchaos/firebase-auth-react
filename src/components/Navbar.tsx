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
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <div>
        <Link to="/" className="mr-4">
          Home
        </Link>
        {isAuthenticated && <Link to="/profile">Profile</Link>}
      </div>
      {isAuthenticated ? (
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className="bg-blue-500 px-4 py-2 rounded mr-2">
            Login
          </Link>
          <Link to="/signup" className="bg-green-500 px-4 py-2 rounded">
            Signup
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
