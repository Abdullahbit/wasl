import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, profileApi, type ApiUser, type ApiProfile } from '../lib/api'

interface AuthContextType {
  user: ApiUser | null
  profile: ApiProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  loginDemoUser: () => Promise<void>
  refreshProfile: () => Promise<void>
  logout: () => Promise<void>
  ensureAuthenticated: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [profile, setProfile] = useState<ApiProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshProfile = useCallback(async () => {
    try {
      const p = await profileApi.get()
      setProfile(p)
    } catch {
      setProfile(null)
    }
  }, [])

  const loginDemoUser = useCallback(async () => {
    setIsLoading(true)
    try {
      // Login with pre-seeded demo user from backend seed.ts
      const res = await authApi.signIn('user@platform.test', 'UserPass123!')
      setUser(res.user)
      await refreshProfile()
    } catch (err) {
      console.error('Failed to log in demo user:', err)
    } finally {
      setIsLoading(false)
    }
  }, [refreshProfile])

  const ensureAuthenticated = useCallback(async () => {
    if (user) return
    try {
      const session = await authApi.getSession()
      if (session.user) {
        setUser(session.user)
        await refreshProfile()
      } else {
        await loginDemoUser()
      }
    } catch {
      await loginDemoUser()
    }
  }, [user, loginDemoUser, refreshProfile])

  useEffect(() => {
    async function initAuth() {
      try {
        const session = await authApi.getSession()
        if (session.user) {
          setUser(session.user)
          await refreshProfile()
        } else {
          // In demo mode, automatically log in as seeded test user
          await loginDemoUser()
        }
      } catch {
        await loginDemoUser()
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [loginDemoUser, refreshProfile])

  const logout = useCallback(async () => {
    try {
      await authApi.signOut()
    } finally {
      setUser(null)
      setProfile(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        loginDemoUser,
        refreshProfile,
        logout,
        ensureAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
