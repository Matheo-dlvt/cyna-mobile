import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("access");
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  const login = async (access: string, refresh: string) => {
    await AsyncStorage.setItem("access", access);
    await AsyncStorage.setItem("refresh", refresh);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access");
    await AsyncStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};