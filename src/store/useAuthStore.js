import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        if (token) localStorage.setItem('auth_token', token)
      },

      loginWithGoogle: () => {
        const mockUser = {
          id: 'google-' + Date.now(),
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: 'G',
          provider: 'google',
        }
        set({ user: mockUser, token: 'mock-google-token', isAuthenticated: true })
      },

      loginWithApple: () => {
        const mockUser = {
          id: 'apple-' + Date.now(),
          name: 'Apple User',
          email: 'user@icloud.com',
          avatar: 'A',
          provider: 'apple',
        }
        set({ user: mockUser, token: 'mock-apple-token', isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('truthlens-auth')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'truthlens-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)