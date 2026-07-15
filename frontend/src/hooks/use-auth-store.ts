import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/api';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

function getStoredAuth() {
  if (typeof window === 'undefined') {
    return { token: null as string | null, user: null as User | null };
  }

  try {
    const raw = localStorage.getItem('rika-auth-storage');
    if (!raw) return { token: null as string | null, user: null as User | null };

    const parsed = JSON.parse(raw) as { state?: { token?: string | null; user?: User | null } };
    return {
      token: parsed?.state?.token ?? null,
      user: parsed?.state?.user ?? null,
    };
  } catch {
    return { token: null as string | null, user: null as User | null };
  }
}

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: initialAuth.token,
      user: initialAuth.user,
      setAuth: (token, user) => {
        console.log('[auth-store] setAuth', { token, user });
        localStorage.setItem('auth_token', token);
        set({ token, user });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'rika-auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<AuthState>),
      }),
    },
  ),
);
