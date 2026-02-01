import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Success } from './pages/Success';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Détecter si on est sur la page success
const isSuccessPage = window.location.pathname === '/success' || window.location.search.includes('session_id');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isSuccessPage ? <Success /> : <App />}
  </React.StrictMode>
);