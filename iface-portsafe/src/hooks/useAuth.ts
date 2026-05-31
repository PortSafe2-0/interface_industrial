import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { authService, AuthResponse } from '@/services/api';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(authService.getUser());
  const [token, setToken] = useState(authService.getToken());

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      return { success: true, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await authService.register({ name, email, password, role });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      return { success: true, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar';
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    router.push('/General/LoginPage');
  }, [router]);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
