import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ProductStoreContext = createContext(null)

export function ProductStoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('angelina_settings')
      return saved ? JSON.parse(saved) : {
        heroTitle: 'Where Luxury Meets Grace',
        heroSubtitle: 'Fashion & Fine Jewellery — Dubai, UAE',
        heroDesc: 'Discover curated collections of exquisite fashion and handcrafted jewellery, designed for the woman who commands every room she enters.',
        heroBadge: 'New Collection 2025',
        marqueeItems: 'Luxury Fashion,Fine Jewellery,Handcrafted,Dubai UAE,New Arrivals,Exclusive Designs',
        storyTitle: 'Crafted with Passion',
        storyBody: 'Born in the heart of Dubai, Angelina was founded on the belief that every woman deserves to feel extraordinary.',
        statYears: '12+',
        statDesigns: '500+',
        contactEmail: 'hello@angelina.ae',
        contactPhone: '+971 50 000 0000',
        contactLocation: 'Dubai, UAE',
      }
    } catch { return {} }
  })

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
    if (!error && data) {
      // Normalize sizes from string to array
      const normalized = data.map(p => ({
        ...p,
        oldPrice: p.old_price,
        sizes: p.sizes ? p.sizes.split(',').map(s => s.trim()) : null,
      }))
      setProducts(normalized)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([{
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
    }]).select()
    if (!error) fetchProducts()
  }

  const updateProduct = async (id, updates) => {
    const { error } = await supabase.from('products').update({
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
    }).eq('id', id)
    if (!error) fetchProducts()
  }

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  const saveSettings = (newSettings) => {
    setSiteSettings(newSettings)
    localStorage.setItem('angelina_settings', JSON.stringify(newSettings))
  }

  return (
    <ProductStoreContext.Provider value={{
      products, loading, addProduct, updateProduct, deleteProduct,
      siteSettings, saveSettings, fetchProducts
    }}>
      {children}
    </ProductStoreContext.Provider>
  )
}

export const useProductStore = () => useContext(ProductStoreContext)
