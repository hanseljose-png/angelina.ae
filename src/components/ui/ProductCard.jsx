import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const BG_COLORS = {
  1: 'linear-gradient(160deg,#f0e8d0,#e8d5a3)',
  2: 'linear-gradient(160deg,#1a1a1a,#2d2d2d)',
  3: 'linear-gradient(160deg,#f5f0e8,#e0d4b8)',
  4: 'linear-gradient(160deg,#0a0a0a,#1f1a10)',
  5: 'linear-gradient(160deg,#e8f0e0,#d4e8c8)',
  6: 'linear-gradient(160deg,#f0f0f0,#e0e0e0)',
  7: 'linear-gradient(160deg,#1a1030,#2d2050)',
  8: 'linear-gradient(160deg,#1a1408,#2d2210)',
}
const ICONS = { fashion: '👗', jewellery: '💎' }

export default function ProductCard({ product, bg }) {
  const [wished, setWished] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addToCart } = useCart()

  return (
    <div style={{ background: 'var(--cream-dark)', position: 'relative', overflow: 'hidden', transition: 'transform 0.4s', transform: hovered ? 'translateY(-4px)' : 'none', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link to={`/shop/${product.id}`}>
        <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg || BG_COLORS[product.id] || BG_COLORS[1], position: 'relative', overflow: 'hidden' }}>
          <span style={{ fontSize: '52px', opacity: 0.2 }}>{ICONS[product.category] || '✦'}</span>
          {product.badge && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: product.badge === 'Sale' ? '#8B6914' : product.category === 'jewellery' ? '#1a1a1a' : 'var(--gold)', color: product.badge === 'Sale' ? '#fff' : product.category === 'jewellery' ? 'var(--gold)' : 'var(--black)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 12px', fontWeight: 600 }}>
              {product.badge}
            </div>
          )}
        </div>
      </Link>
      <button onClick={() => setWished(!wished)}
        style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', opacity: hovered || wished ? 1 : 0, transition: 'opacity 0.3s', color: wished ? '#e11d48' : '#666' }}>
        {wished ? '♥' : '♡'}
      </button>
      <div style={{ padding: '20px 20px 24px', background: 'var(--cream-dark)' }}>
        <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>Angelina {product.category === 'fashion' ? 'Couture' : 'Jewels'}</div>
        <Link to={`/shop/${product.id}`}><div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', fontWeight: 400, color: 'var(--black)', marginBottom: '10px', lineHeight: 1.2 }}>{product.name}</div></Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--black)' }}>
            AED {product.price.toLocaleString()}
            {product.oldPrice && <span style={{ fontSize: '11px', color: '#999', fontWeight: 300, textDecoration: 'line-through', marginLeft: '8px' }}>AED {product.oldPrice.toLocaleString()}</span>}
          </div>
          <button onClick={() => addToCart(product)} style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}>Add +</button>
        </div>
      </div>
    </div>
  )
}
