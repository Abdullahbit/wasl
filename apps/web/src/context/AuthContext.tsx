import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi, profileApi, type ApiUser, type ApiProfile } from '../lib/api'
import { communityStore, type CommunityUserProfile, type AccountType } from '../lib/communityStore'

interface AuthContextType {
  user: ApiUser | null
  profile: ApiProfile | null
  accountType: AccountType
  communityProfile: CommunityUserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  loginDemoUser: () => Promise<void>
  loginAsCommunity: (name: string, email: string) => Promise<void>
  switchAccountType: (type: AccountType) => void
  refreshProfile: () => Promise<void>
  refreshCommunityProfile: () => void
  logout: () => Promise<void>
  ensureAuthenticated: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [profile, setProfile] = useState<ApiProfile | null>(null)
  const [accountType, setAccountType] = useState<AccountType>(() => {
    return (localStorage.getItem('wasl_account_type') as AccountType) || 'STUDENT'
  })
  const [communityProfile, setCommunityProfile] = useState<CommunityUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshCommunityProfile = useCallback(() => {
    if (user) {
      const cp = communityStore.getCommunityProfile(user.id)
      setCommunityProfile(cp)
    }
  }, [user])

  const switchAccountType = useCallback((type: AccountType) => {
    setAccountType(type)
    localStorage.setItem('wasl_account_type', type)
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      const p = await profileApi.get()
      setProfile(p)
    } catch {
      setProfile(null)
    }
    refreshCommunityProfile()
  }, [refreshCommunityProfile])

  const loginDemoUser = useCallback(async () => {
    setIsLoading(true)
    localStorage.removeItem('wasl_user_logged_out')
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
    const loggedOutFlag = localStorage.getItem('wasl_user_logged_out') === 'true'
    if (loggedOutFlag) return

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
      const loggedOutFlag = localStorage.getItem('wasl_user_logged_out') === 'true'
      if (loggedOutFlag) {
        setIsLoading(false)
        return
      }

      try {
        const session = await authApi.getSession()
        if (session.user) {
          setUser(session.user)
          await refreshProfile()
        } else {
          // In initial demo mode, log in as seeded test user
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

  const loginAsCommunity = useCallback(async (name: string, email: string) => {
    setIsLoading(true)
    localStorage.removeItem('wasl_user_logged_out')
    try {
      // Set user as community account
      setUser({
        id: `com_user_${Date.now()}`,
        name,
        email,
        role: 'COMMUNITY',
        emailVerified: true,
      })
      switchAccountType('COMMUNITY')
      refreshCommunityProfile()
    } finally {
      setIsLoading(false)
    }
  }, [switchAccountType, refreshCommunityProfile])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      localStorage.setItem('wasl_user_logged_out', 'true')
      await authApi.signOut().catch(() => {})
    } finally {
      setUser(null)
      setProfile(null)
      setCommunityProfile(null)
      setIsLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        accountType,
        communityProfile,
        isLoading,
        isAuthenticated: !!user,
        loginDemoUser,
        loginAsCommunity,
        switchAccountType,
        refreshProfile,
        refreshCommunityProfile,
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
