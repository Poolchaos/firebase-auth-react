import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './authSlice';
import { auth } from '../../firebaseConfig';

const AuthListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          dispatch(
            loginSuccess({
              user: { id: user.uid, email: user.email },
              token: token,
            }),
          );
        });
      } else {
        dispatch(logout());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return null;
};

export default AuthListener;
