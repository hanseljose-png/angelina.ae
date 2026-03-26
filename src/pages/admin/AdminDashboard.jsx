import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { useProductStore } from '../../context/ProductStore'
import AdminProducts from './AdminProducts'
import AdminSettings from './AdminSettings'

const NAV = [
  { id: 'products', label: 'Products', icon: '◈' },
  { id: 'settings', label: 'Site Content', icon: '◉' },
  { id: 'orders', label: 'Orders', icon: '◎' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const { logout } = useAdmin()
  const { products } = useProductStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const stats = [
    { label: 'Total Products', value: products.length },
    { label: 'Fashion Items', value: products.filter(p => p.category === 'fashion').length },
    { label: 'Jewellery Items', value: products.filter(p => p.category === 'jewellery').length },
    { label: 'On Sale', value: products.filter(p => p.badge === 'Sale').length },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d0d0d', fontFamily: 'var(--font-sans)' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '240px', background: '#0a0a0a', borderRight: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', letterSpacing: '5px', color: 'var(--gold)', textTransform: 'uppercase' }}>Angelina</div>
          <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)', marginTop: '4px' }}>Admin Panel</div>
        </div>

        <nav style={{ padding: '24px 0', flex: 1 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 28px', border: 'none', background: tab === item.id ? 'rgba(201,168,76,0.08)' : 'transparent', color: tab === item.id ? 'var(--gold)' : 'rgba(250,248,243,0.4)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', borderLeft: tab === item.id ? '2px solid var(--gold)' : '2px solid transparent', transition: 'all 0.2s', fontFamily: 'var(--font-sans)' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <Link to="/" target="_blank" style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginBottom: '12px' }}>↗ View Store</Link>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', border: '1px solid rgba(201,168,76,0.15)', background: 'transparent', color: 'rgba(250,248,243,0.3)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.target.style.borderColor = 'rgba(220,38,38,0.4)'; e.target.style.color = '#f87171' }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(201,168,76,0.15)'; e.target.style.color = 'rgba(250,248,243,0.3)' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0a0a' }}>
          <div>
            <div style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--cream)' }}>
              {tab === 'products' ? 'Product Management' : tab === 'settings' ? 'Site Content' : 'Orders'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)', marginTop: '2px' }}>angelina.ae</div>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)', letterSpacing: '1px' }}>
            {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats row */}
        {tab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(201,168,76,0.08)', margin: '0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: '#0d0d0d', padding: '24px 32px' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 300, color: 'var(--gold)' }}>{s.value}</div>
                <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '32px 40px' }}>
          {tab === 'products' && <AdminProducts />}
          {tab === 'settings' && <AdminSettings />}
          {tab === 'orders' && (
            <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(250,248,243,0.3)' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '12px', color: 'rgba(250,248,243,0.15)' }}>Orders</div>
              <div style={{ fontSize: '12px', letterSpacing: '2px' }}>Connect a payment gateway (PayTabs / Telr) to manage orders here.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
