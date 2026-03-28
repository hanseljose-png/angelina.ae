import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addToCart = (product) => {
    const stock = product.stock ?? 0
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        // Don't exceed stock
        if (existing.qty >= stock) return prev
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      if (stock === 0) return prev // out of stock
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id)
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i
      const stock = i.stock ?? 0
      // Cap at stock level
      const safeQty = stock > 0 ? Math.min(qty, stock) : qty
      return { ...i, qty: safeQty }
    }))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
