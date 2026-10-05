import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, getErrorMessage } from '../services/api';

const AuthContext = createContext();

// Both key pairs are kept in sync: older parts of the app read the legacy names.
const TOKEN_KEYS = ['token', 'healthcare_admin_token'];
const USER_KEYS = ['user', 'healthcare_admin_user'];

const readStoredSession = () => {
  const token = TOKEN_KEYS.map(k => localStorage.getItem(k)).find(Boolean) || null;
  let user = null;
  const rawUser = USER_KEYS.map(k => localStorage.getItem(k)).find(Boolean);
  if (token && rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }
  return { token, user: token ? (user || { name: 'Administrator' }) : null };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredSession);

  const logout = useCallback(() => {
    [...TOKEN_KEYS, ...USER_KEYS].forEach(k => localStorage.removeItem(k));
    setSession({ token: null, user: null });
  }, []);

  // Any authenticated request that comes back 401 signs the admin out
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email.trim(), password);
      if (data.success && data.token) {
        TOKEN_KEYS.forEach(k => localStorage.setItem(k, data.token));
        USER_KEYS.forEach(k => localStorage.setItem(k, JSON.stringify(data.user)));
        setSession({ token: data.token, user: data.user });
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, 'Login failed. Please check your credentials.')
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        login,
        logout,
        loading: false,
        isAuthenticated: !!session.token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
