import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Shop } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  shop: Shop | null;
  isLoading: boolean;
  login: (token: string, user: User, shop?: Shop) => void;
  logout: () => void;
  isAdmin: boolean;
  isReseller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getUser();
    const savedShop = authService.getShop();
    if (savedUser) setUser(savedUser);
    if (savedShop) setShop(savedShop);
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User, shopData?: Shop) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (shopData) localStorage.setItem('shop', JSON.stringify(shopData));
    setUser(userData);
    if (shopData) setShop(shopData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setShop(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        shop,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'admin',
        isReseller: user?.role === 'reseller',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
