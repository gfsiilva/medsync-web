import { createContext, useState, useContext } from 'react'
import type { ReactNode } from 'react'
import type { AuthState, User } from '../types/auth'

// Formato completo do contexto
export interface AuthContextProps extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
}

// Contexto
export const AuthContext = createContext({} as AuthContextProps)

// Hook
export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return context
}

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  function login(user: User, token: string) {
    setUser(user)
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}