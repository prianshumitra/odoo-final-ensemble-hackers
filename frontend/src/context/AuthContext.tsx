import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, setAuthHeaders } from '../services/api';

export type AuthRole = 'customer' | 'vendor' | 'admin';
export type AuthStatus = 'active' | 'pending' | 'suspended';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  status: AuthStatus;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  gstNo?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  profileImageUrl?: string;
  companyLogoUrl?: string;
}

interface StoredSession {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isVendorApproved: boolean;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
  refreshUser: () => Promise<AuthUser | null>;
}

const STORAGE_KEY = 'ezrent.auth.session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeUser = (user: any): AuthUser => ({
  id: String(user.id || user._id || ''),
  name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
  email: user.email,
  role: (user.role || 'customer') as AuthRole,
  status: (user.status || 'active') as AuthStatus,
  firstName: user.firstName || '',
  lastName: user.lastName || '',
  companyName: user.companyName || '',
  gstNo: user.gstNo || '',
  phone: user.phone || '',
  address: user.address || {},
  profileImageUrl: user.profileImageUrl || '',
  companyLogoUrl: user.companyLogoUrl || '',
});

const readStoredSession = (): StoredSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || !parsed?.user) {
      return null;
    }
    return {
      token: parsed.token,
      user: normalizeUser(parsed.user),
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<StoredSession | null>(() => readStoredSession());

  useEffect(() => {
    if (session) {
      setAuthHeaders(session.user, session.token);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      setAuthHeaders(null, null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const signIn = (token: string, user: AuthUser) => {
    setSession({
      token,
      user: normalizeUser(user),
    });
  };

  const signOut = () => {
    setSession(null);
  };

  const refreshUser = async () => {
    if (!session?.token) {
      return null;
    }

    try {
      const me = await authService.getMe();
      const nextUser = normalizeUser(me);
      setSession((current) =>
        current
          ? {
              ...current,
              user: nextUser,
            }
          : current
      );
      return nextUser;
    } catch {
      signOut();
      return null;
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      isAuthenticated: !!session?.token,
      isVendorApproved:
        !!session?.user &&
        (session.user.role === 'admin' ||
          (session.user.role === 'vendor' && session.user.status === 'active')),
      signIn,
      signOut,
      refreshUser,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
