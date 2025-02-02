import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import { persistor, store } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [rehydrated, setRehydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.auth._persist && state.auth._persist.rehydrated) {
        setRehydrated(true);
        setIsLoading(false);
        unsubscribe();
      }
    });
  }, []);

  console.log(' ::>> rehydrated ', rehydrated, isLoading);

  if (!rehydrated || isLoading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
};

export default App;
