import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from '../components/Navbar';
import AppRoutes from '../routes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
