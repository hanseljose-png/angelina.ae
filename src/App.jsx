import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { CartProvider } from './context/CartContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { ProductStoreProvider } from './context/ProductStore'

function ProtectedAdmin() {
  const { isLoggedIn } = useAdmin()
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  return <AdminDashboard />
}

function StoreLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AdminProvider>
      <ProductStoreProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdmin />} />
              <Route path="/*" element={<StoreLayout />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ProductStoreProvider>
    </AdminProvider>
  )
}

export default App
