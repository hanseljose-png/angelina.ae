import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeFromCart, updateQty, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <main style={{ paddingTop: '160px', minHeight: '100vh', background: 'var(--cream)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '60px', fontWeight: 300, color: 'var(--black)', marginBottom: '16px' }}>Your Cart is Empty</div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '40px' }}>Discover our luxury collections</p>
      <Link to="/shop" className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)' }}>Continue Shopping →</Link>
    </main>
  )

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ padding: '40px 60px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 300, color: 'var(--black)', marginBottom: '40px' }}>
          Shopping <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Cart</em>
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
          <div>
            {items.map(item => {
              const stock = item.stock ?? 0
              const atMax = item.qty >= stock && stock > 0

              return (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '24px', padding: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', alignItems: 'center' }}>
                  {/* Thumbnail */}
                  <div style={{ aspectRatio: '1', background: 'var(--cream-dark)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '32px', opacity: 0.3 }}>{item.category === 'jewellery' ? '💎' : '👗'}</span>}
                  </div>

                  <div>
                    <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Angelina {item.category === 'fashion' ? 'Couture' : 'Jewels'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, color: 'var(--black)', marginBottom: '12px' }}>{item.name}</div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{ width: '28px', height: '28px', border: '1px solid rgba(0,0,0,0.2)', background: 'transparent', fontSize: '16px', cursor: 'pointer' }}>−</button>
                      <span style={{ fontSize: '14px', fontWeight: 500, minWidth: '20px', textAlign: 'center', color: 'var(--black)' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={atMax}
                        title={atMax ? `Max available: ${stock}` : ''}
                        style={{ width: '28px', height: '28px', border: '1px solid rgba(0,0,0,0.2)', background: 'transparent', fontSize: '16px', cursor: atMax ? 'not-allowed' : 'pointer', opacity: atMax ? 0.35 : 1 }}>+</button>
                    </div>

                    {/* Stock warning */}
                    {atMax && (
                      <div style={{ fontSize: '11px', color: '#fbbf24', marginTop: '6px', letterSpacing: '1px' }}>
                        ⚠ Maximum available stock: {stock}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--black)', marginBottom: '12px' }}>
                      AED {(item.price * item.qty).toLocaleString()}
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div style={{ background: 'var(--black)', padding: '40px', position: 'sticky', top: '100px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.6)' }}>Subtotal</span>
              <span style={{ fontSize: '13px', color: 'var(--cream)' }}>AED {total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.6)' }}>Shipping</span>
              <span style={{ fontSize: '13px', color: 'var(--gold)' }}>Free</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--cream)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--gold)' }}>AED {total.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', background: 'var(--gold)', color: 'var(--black)', border: 'none' }}>
              Proceed to Checkout →
            </button>
            <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
