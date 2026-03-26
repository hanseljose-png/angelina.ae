import { createContext, useContext, useState } from 'react'
import { products as initialProducts } from '../data/products'

const ProductStoreContext = createContext(null)

export function ProductStoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('angelina_products')
      return saved ? JSON.parse(saved) : initialProducts
    } catch { return initialProducts }
  })

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
        storyBody: 'Born in the heart of Dubai, Angelina was founded on the belief that every woman deserves to feel extraordinary. We blend traditional craftsmanship with contemporary elegance, creating pieces that transcend trends.',
        statYears: '12+',
        statDesigns: '500+',
        contactEmail: 'hello@angelina.ae',
        contactPhone: '+971 50 000 0000',
        contactLocation: 'Dubai, UAE',
      }
    } catch { return {} }
  })

  const save = (newProducts) => {
    setProducts(newProducts)
    localStorage.setItem('angelina_products', JSON.stringify(newProducts))
  }

  const saveSettings = (newSettings) => {
    setSiteSettings(newSettings)
    localStorage.setItem('angelina_settings', JSON.stringify(newSettings))
  }

  const addProduct = (product) => {
    const newList = [...products, { ...product, id: Date.now() }]
    save(newList)
  }

  const updateProduct = (id, updates) => {
    const newList = products.map(p => p.id === id ? { ...p, ...updates } : p)
    save(newList)
  }

  const deleteProduct = (id) => {
    const newList = products.filter(p => p.id !== id)
    save(newList)
  }

  const reorderProducts = (newList) => save(newList)

  return (
    <ProductStoreContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, reorderProducts, siteSettings, saveSettings }}>
      {children}
    </ProductStoreContext.Provider>
  )
}

export const useProductStore = () => useContext(ProductStoreContext)
