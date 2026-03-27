import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useProductStore } from '../context/ProductStore'
import { useCart } from '../context/CartContext'

const BG_COLORS = {
  1:'linear-gradient(160deg,#f0e8d0,#e8d5a3)',2:'linear-gradient(160deg,#1a1a1a,#2d2d2d)',
  3:'linear-gradient(160deg,#f5f0e8,#e0d4b8)',4:'linear-gradient(160deg,#0a0a0a,#1f1a10)',
  5:'linear-gradient(160deg,#e8f0e0,#d4e8c8)',6:'linear-gradient(160deg,#f0f0f0,#e0e0e0)',
  7:'linear-gradient(160deg,#1a1030,#2d2050)',8:'linear-gradient(160deg,#1a1408,#2d2210)',
}

export default function ProductPage() {
  const { id } = useParams()
  const { products } = useProductStore()
  const product = products.find(p => p.id === Number(id))
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { addToCart } = useCart()

  if (!product) return (
    <div style={{ padding: '200px 60px', textAlign: 'center', color: 'var(--black)', minHeight: '100vh', background: 'var(--cream)' }}>
      Product not found. <Link to="/shop" style={{ color: 'var(--gold)' }}>Back to shop</Link>
    </div>
  )

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const hasImage = product.image_url && !imgError

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '20px 60px', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
        <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link> /&nbsp;
        <Link to="/shop" style={{ color: 'var(--text-muted)' }}>Shop</Link> / {product.name}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', minHeight: '80vh' }}>
        {/* Product Image */}
        <div style={{ position: 'relative', overflow: 'hidden', background: BG_COLORS[product.id] || BG_COLORS[1], display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
          {hasImage ? (
            <img src={product.image_url} alt={product.name}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', position: 'absolute', inset: 0 }} />
          ) : (
            <span style={{ fontSize: '80px', opacity: 0.2 }}>{product.category === 'jewellery' ? '💎' : '👗'}</span>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: '60px', background: 'var(--cream)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {product.badge && (
            <div style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--black)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 12px', fontWeight: 600, marginBottom: '20px', width: 'fit-content' }}>{product.badge}</div>
          )}
          <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Angelina {product.category === 'fashion' ? 'Couture' : 'Jewels'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, color: 'var(--black)', lineHeight: 1.1, marginBottom: '16px' }}>{product.name}</h1>
          <div style={{ fontSize: '28px', fontWeight: 500, color: 'var(--black)', marginBottom: '8px' }}>
            AED {product.price?.toLocaleString()}
            {(product.oldPrice || product.old_price) && (
              <span style={{ fontSize: '16px', color: '#999', fontWeight: 300, textDecoration: 'line-through', marginLeft: '12px' }}>
                AED {(product.oldPrice || product.old_price)?.toLocaleString()}
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.9, color: 'var(--text-muted)', marginBottom: '32px' }}>{product.description}</p>

          {/* Material & Origin */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {[['Material', product.material], ['Origin', product.origin]].map(([k, v]) => v && (
              <div key={k} style={{ padding: '16px', background: 'var(--cream-dark)' }}>
                <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>{k}</div>
                <div style={{ fontSize: '13px', color: 'var(--black)', fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>Select Size</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    style={{ width: '44px', height: '44px', border: '1px solid', fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s', background: selectedSize === s ? 'var(--black)' : 'transparent', color: selectedSize === s ? 'var(--gold)' : 'var(--black)', borderColor: selectedSize === s ? 'var(--black)' : 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-sans)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button onClick={handleAdd} className="btn-primary"
            style={{ justifyContent: 'center', background: added ? '#1a5c1a' : 'var(--black)', color: added ? '#fff' : 'var(--gold)', transition: 'all 0.4s', border: 'none' }}>
            {added ? '✓ Added to Cart' : 'Add to Cart →'}
          </button>
        </div>
      </div>
    </main>
  )
}
