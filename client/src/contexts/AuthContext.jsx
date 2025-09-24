import { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      }
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: 'LOAD_USER', payload: user })
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    dispatch({ type: 'LOGIN', payload: { user: userData } })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}