import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,168,76,0.15)', color: 'var(--gold)' },
  confirmed: { bg: 'rgba(29,78,216,0.15)', color: '#93c5fd' },
  delivered: { bg: 'rgba(22,163,74,0.15)', color: '#4ade80' },
  cancelled: { bg: 'rgba(220,38,38,0.15)', color: '#f87171' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gold)' }}>Loading orders...</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>
      <div>
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 100px 120px', padding: '14px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)' }}>
            <span>Order #</span><span>Customer</span><span>Total</span><span>Status</span><span style={{ textAlign: 'right' }}>Date</span>
          </div>
          {orders.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,243,0.2)' }}>No orders yet</div>}
          {orders.map((o, i) => (
            <div key={o.id} onClick={() => setSelected(o)}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 100px 120px', padding: '16px 24px', borderBottom: i < orders.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', alignItems: 'center', cursor: 'pointer', background: selected?.id === o.id ? 'rgba(201,168,76,0.05)' : 'transparent', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = selected?.id === o.id ? 'rgba(201,168,76,0.05)' : 'transparent'}>
              <div style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{o.order_number}</div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--cream)' }}>{o.customer_name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)' }}>{o.customer_phone}</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--cream)' }}>AED {o.total_amount?.toLocaleString()}</div>
              <div><span style={{ fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', ...STATUS_COLORS[o.status] }}>{o.status}</span></div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)', textAlign: 'right' }}>{new Date(o.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '28px', position: 'sticky', top: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)' }}>Order Details</div>
            <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(250,248,243,0.4)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--gold)', marginBottom: '20px' }}>{selected.order_number}</div>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            {[['Customer', selected.customer_name], ['Email', selected.customer_email], ['Phone', selected.customer_phone], ['Address', `${selected.delivery_address}, ${selected.delivery_city}`], ['Payment', selected.payment_method], ['Total', `AED ${selected.total_amount?.toLocaleString()}`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', minWidth: '70px', paddingTop: '2px' }}>{k}</span>
                <span style={{ fontSize: '13px', color: 'var(--cream)' }}>{v}</span>
              </div>
            ))}
            {selected.notes && (
              <div style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontStyle: 'italic', marginTop: '4px' }}>Note: {selected.notes}</div>
            )}
          </div>

          {/* Items */}
          {selected.items && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginBottom: '12px' }}>Items Ordered</div>
              {JSON.parse(selected.items).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--cream)', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                  <span>{item.name} × {item.qty}</span>
                  <span>AED {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Update status */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginBottom: '12px' }}>Update Status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['pending', 'confirmed', 'delivered', 'cancelled'].map(status => (
                <button key={status} onClick={() => updateStatus(selected.id, status)}
                  style={{ padding: '10px', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: selected.status === status ? 700 : 400, ...STATUS_COLORS[status], border: selected.status === status ? '2px solid currentColor' : '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <a href={`tel:${selected.customer_phone}`}
            style={{ display: 'block', padding: '12px', background: 'var(--gold)', color: 'var(--black)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
            Call Customer →
          </a>
        </div>
      )}
    </div>
  )
}
