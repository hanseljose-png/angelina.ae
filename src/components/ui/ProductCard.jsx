import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const BG_COLORS = {
  1:'linear-gradient(160deg,#f0e8d0,#e8d5a3)',2:'linear-gradient(160deg,#1a1a1a,#2d2d2d)',
  3:'linear-gradient(160deg,#f5f0e8,#e0d4b8)',4:'linear-gradient(160deg,#0a0a0a,#1f1a10)',
  5:'linear-gradient(160deg,#e8f0e0,#d4e8c8)',6:'linear-gradient(160deg,#f0f0f0,#e0e0e0)',
  7:'linear-gradient(160deg,#1a1030,#2d2050)',8:'linear-gradient(160deg,#1a1408,#2d2210)',
}
const ICONS = { fashion: '👗', jewellery: '💎' }

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { addToCart, items } = useCart()

  const hasImage = product.image_url && !imgError
  const stock = product.stock ?? 0
  const inCart = items.find(i => i.id === product.id)?.qty || 0
  const outOfStock = stock === 0
  const maxReached = inCart >= stock

  const handleAdd = () => {
    if (outOfStock || maxReached) return
    addToCart(product)
  }

  return (
    <div style={{ background: 'var(--cream-dark)', position: 'relative', overflow: 'hidden', transition: 'transform 0.4s', transform: hovered && !outOfStock ? 'translateY(-4px)' : 'none', cursor: outOfStock ? 'default' : 'pointer' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      <Link to={`/shop/${product.id}`}>
        <div style={{ aspectRatio: '2/3', position: 'relative', overflow: 'hidden', background: BG_COLORS[product.id] || (product.category === 'jewellery' ? BG_COLORS[2] : BG_COLORS[1]) }}>
          {hasImage && (
            <img src={product.image_url} alt={product.name} onError={() => setImgError(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.6s ease', transform: hovered && !outOfStock ? 'scale(1.05)' : 'scale(1)' }} />
          )}
          {!hasImage && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: outOfStock ? 0.3 : 1 }}>
              <span style={{ fontSize: '52px', opacity: 0.2 }}>{ICONS[product.category] || '✦'}</span>
            </div>
          )}

          {/* Out of Stock overlay */}
          {outOfStock && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', zIndex: 2 }}>
              <div style={{ background: 'rgba(0,0,0,0.8)', color: 'rgba(250,248,243,0.9)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', padding: '10px 20px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                Out of Stock
              </div>
            </div>
          )}

          {/* Low stock warning */}
          {!outOfStock && stock <= 3 && (
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(251,191,36,0.9)', color: '#0a0a0a', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 10px', fontWeight: 700, zIndex: 2 }}>
              Only {stock} left
            </div>
          )}

          {/* Badge */}
          {product.badge && !outOfStock && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: product.badge === 'Sale' ? '#8B6914' : product.category === 'jewellery' ? '#1a1a1a' : 'var(--gold)', color: product.badge === 'Sale' ? '#fff' : product.category === 'jewellery' ? 'var(--gold)' : 'var(--black)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 12px', fontWeight: 600, zIndex: 2 }}>
              {product.badge}
            </div>
          )}

          {/* Hover overlay */}
          {hasImage && !outOfStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }} />
          )}
        </div>
      </Link>

      {/* Wishlist */}
      {!outOfStock && (
        <button onClick={() => setWished(!wished)}
          style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', opacity: hovered || wished ? 1 : 0, transition: 'opacity 0.3s', color: wished ? '#e11d48' : '#666', cursor: 'pointer', zIndex: 2 }}>
          {wished ? '♥' : '♡'}
        </button>
      )}

      {/* Info */}
      <div style={{ padding: '14px 16px 18px', background: 'var(--cream-dark)' }}>
        <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Angelina {product.category === 'fashion' ? 'Couture' : 'Jewels'}
        </div>
        <Link to={`/shop/${product.id}`}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 400, color: outOfStock ? 'rgba(0,0,0,0.4)' : 'var(--black)', marginBottom: '10px', lineHeight: 1.2 }}>{product.name}</div>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: outOfStock ? 'rgba(0,0,0,0.4)' : 'var(--black)' }}>
            AED {product.price?.toLocaleString()}
            {(product.oldPrice || product.old_price) && (
              <span style={{ fontSize: '11px', color: '#999', fontWeight: 300, textDecoration: 'line-through', marginLeft: '8px' }}>
                AED {(product.oldPrice || product.old_price)?.toLocaleString()}
              </span>
            )}
          </div>
          {outOfStock
            ? <span style={{ fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: '#f87171', fontWeight: 600 }}>Sold Out</span>
            : <button onClick={handleAdd} disabled={maxReached}
                style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: maxReached ? 'rgba(0,0,0,0.3)' : 'var(--gold)', fontWeight: 600, border: 'none', background: 'none', cursor: maxReached ? 'not-allowed' : 'pointer' }}>
                {maxReached ? 'Max qty' : 'Add +'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
