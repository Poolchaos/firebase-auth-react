import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBb2IfUFcFs8XOXPLl8pDy96U9pJXrjKkE',
  authDomain: 'fir-auth-react-e082e.firebaseapp.com',
  projectId: 'fir-auth-react-e082e',
  storageBucket: 'fir-auth-react-e082e.firebasestorage.app',
  messagingSenderId: '906500367534',
  appId: '1:906500367534:web:29c3a30a58b215f9ebf93f',
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
