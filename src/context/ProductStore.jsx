import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ProductStoreContext = createContext(null)

export function ProductStoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [siteSettings, setSiteSettings] = useState({})
  const [loadingSettings, setLoadingSettings] = useState(true)

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoadingProducts(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) {
      const normalized = data.map(p => ({
        ...p,
        oldPrice: p.old_price,
        sizes: p.sizes ? p.sizes.split(',').map(s => s.trim()) : null,
      }))
      setProducts(normalized)
    }
    setLoadingProducts(false)
  }

  // Fetch site settings from Supabase
  const fetchSettings = async () => {
    setLoadingSettings(true)
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
    if (!error && data) {
      const settingsObj = {}
      data.forEach(row => { settingsObj[row.key] = row.value })
      setSiteSettings(settingsObj)
    }
    setLoadingSettings(false)
  }

  useEffect(() => {
    fetchProducts()
    fetchSettings()
  }, [])

  const addProduct = async (product) => {
    await supabase.from('products').insert([{
      name: product.name,
      category: product.category,
      price: Number(product.price),
      old_price: product.oldPrice ? Number(product.oldPrice) : null,
      badge: product.badge || null,
      description: product.description || null,
      material: product.material || null,
      origin: product.origin || null,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : (product.sizes || null),
      image_url: product.image_url || null,
      stock: product.stock !== undefined ? Number(product.stock) : 0,
    }])
    fetchProducts()
  }

  const updateProduct = async (id, updates) => {
    await supabase.from('products').update({
      name: updates.name,
      category: updates.category,
      price: Number(updates.price),
      old_price: updates.oldPrice ? Number(updates.oldPrice) : null,
      badge: updates.badge || null,
      description: updates.description || null,
      material: updates.material || null,
      origin: updates.origin || null,
      sizes: Array.isArray(updates.sizes) ? updates.sizes.join(',') : (updates.sizes || null),
      image_url: updates.image_url || null,
      stock: updates.stock !== undefined ? Number(updates.stock) : 0,
    }).eq('id', id)
    fetchProducts()
  }

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  // Save a single setting to Supabase
  const saveSetting = async (key, value) => {
    await supabase.from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' })
  }

  // Save all settings at once
  const saveSettings = async (newSettings) => {
    const updates = Object.entries(newSettings).map(([key, value]) => ({
      key, value: value || ''
    }))
    await supabase.from('site_settings')
      .upsert(updates, { onConflict: 'key' })
    setSiteSettings(newSettings)
  }

  const loading = loadingProducts || loadingSettings

  return (
    <ProductStoreContext.Provider value={{
      products, loading, addProduct, updateProduct, deleteProduct,
      fetchProducts, siteSettings, saveSettings, saveSetting, fetchSettings
    }}>
      {children}
    </ProductStoreContext.Provider>
  )
}

export const useProductStore = () => useContext(ProductStoreContext)
