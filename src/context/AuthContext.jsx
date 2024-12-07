/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const value = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
