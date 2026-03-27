import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    if (data) setSubscribers(data)
    setLoading(false)
  }

  const toggleActive = async (id, current) => {
    await supabase.from('newsletter_subscribers').update({ active: !current }).eq('id', id)
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, active: !current } : s))
  }

  const deleteSubscriber = async (id) => {
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    setSubscribers(prev => prev.filter(s => s.id !== id))
  }

  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()))
  const activeCount = subscribers.filter(s => s.active).length

  const exportCSV = () => {
    const csv = ['Email,Date,Source,Active', ...subscribers.map(s =>
      `${s.email},${new Date(s.subscribed_at).toLocaleDateString()},${s.source || 'homepage'},${s.active ? 'Yes' : 'No'}`
    )].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'angelina-subscribers.csv'; a.click()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gold)' }}>Loading...</div>

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(201,168,76,0.08)', marginBottom: '32px' }}>
        {[['Total Subscribers', subscribers.length], ['Active', activeCount], ['Unsubscribed', subscribers.length - activeCount]].map(([label, val]) => (
          <div key={label} style={{ background: '#0d0d0d', padding: '24px 32px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: 300, color: 'var(--gold)' }}>{val}</div>
            <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..."
          style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', color: 'var(--cream)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)', width: '280px' }} />
        <button onClick={exportCSV}
          style={{ padding: '11px 24px', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          ↓ Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', padding: '14px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)' }}>
          <span>Email</span><span>Date</span><span>Source</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>
            {search ? 'No results found' : 'No subscribers yet. They will appear here when people sign up.'}
          </div>
        )}
        {filtered.map((s, i) => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', padding: '14px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.active ? '#4ade80' : 'rgba(250,248,243,0.2)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: s.active ? 'var(--cream)' : 'rgba(250,248,243,0.4)' }}>{s.email}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)' }}>
              {new Date(s.subscribed_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)', textTransform: 'capitalize' }}>{s.source || 'homepage'}</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => toggleActive(s.id, s.active)}
                style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${s.active ? 'rgba(250,248,243,0.15)' : 'rgba(74,222,128,0.3)'}`, color: s.active ? 'rgba(250,248,243,0.4)' : '#4ade80', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                {s.active ? 'Unsub' : 'Resub'}
              </button>
              <button onClick={() => deleteSubscriber(s.id)}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
