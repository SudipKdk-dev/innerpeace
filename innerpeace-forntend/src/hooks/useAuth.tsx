import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, login as loginRequest, type User } from '@/api/auth';
import { clearToken, getToken, setToken } from '@/lib/storage';

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    enabled: Boolean(token),
    retry: false,
  });

  // Handle auth error - clear token when query fails
  React.useEffect(() => {
    if (meQuery.isError) {
      clearToken();
      setTokenState(null);
    }
  }, [meQuery.isError]);

  const login = async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setToken(result.access_token);
    setTokenState(result.access_token);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    queryClient.removeQueries({ queryKey: ['auth', 'me'] });
  };

  useEffect(() => {
    const syncToken = () => setTokenState(getToken());
    window.addEventListener('storage', syncToken);
    window.addEventListener('auth:logout', syncToken as EventListener);
    return () => {
      window.removeEventListener('storage', syncToken);
      window.removeEventListener('auth:logout', syncToken as EventListener);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(token && meQuery.data),
      isLoading: meQuery.isLoading,
      login,
      logout
    }),
    [token, meQuery.data, meQuery.isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
