import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { loginSuccess } from './features/auth/authSlice';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { logoutUser } from './services/authService';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/REMOVE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);

onAuthStateChanged(getAuth(), async (user) => {
  if (user) {
    try {
      const token = await user.getIdToken();
      store.dispatch(
        loginSuccess({
          user: { id: user.uid, email: user.email },
          token,
        }),
      );
    } catch (error) {
      console.error('Error getting token:', error);
    }
  } else {
    store.dispatch(logoutUser());
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
