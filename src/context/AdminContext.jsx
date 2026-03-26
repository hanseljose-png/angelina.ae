import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

// Simple admin credentials (in production, use a real backend/auth)
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'angelina2025'

export function AdminProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('angelina_admin') === 'true')

  const login = (user, pass) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('angelina_admin', 'true')
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('angelina_admin')
    setIsLoggedIn(false)
  }

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
