import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ErrorBoundary>
      {/* AuthProvider 提供用户认证相关的上下文 */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </Provider>
);
