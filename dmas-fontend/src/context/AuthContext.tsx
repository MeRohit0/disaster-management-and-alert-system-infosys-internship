import React, { createContext, useState, useContext } from 'react';

interface AuthContextType {
  user: any | null;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedId = localStorage.getItem('userId'); // Get the ID
    const savedName = localStorage.getItem('userName');
    const savedLocation = localStorage.getItem('userLocation');

    // Return the full object so components like dashboards work on refresh
    return savedToken ? { 
      token: savedToken, 
      role: savedRole, 
      id: savedId ? parseInt(savedId) : null, // Ensure it's a number
      name: savedName,
      location: savedLocation
    } : null;
  });

  const login = (data: any) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userName', data.name || '');
    localStorage.setItem('userLocation', data.location || '');
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;