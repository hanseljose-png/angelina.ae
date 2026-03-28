import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import ShippingPage from './pages/ShippingPage'
import SizeGuidePage from './pages/SizeGuidePage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { CartProvider } from './context/CartContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import { ProductStoreProvider } from './context/ProductStore'

function PageTracker() {
  const location = useLocation()
  useEffect(() => {
    const track = async () => {
      try {
        const { supabase } = await import('./lib/supabase')
        await supabase.from('site_visits').insert([{
          page: location.pathname + location.search,
          referrer: document.referrer || 'direct',
          user_agent: navigator.userAgent.substring(0, 300),
          visited_at: new Date().toISOString(),
        }])
      } catch (e) {}
    }
    track()
  }, [location.pathname])
  return null
}

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
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/size-guide" element={<SizeGuidePage />} />
        <Route path="/contact" element={<ContactPage />} />
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
            <PageTracker />
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
