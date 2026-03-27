import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setMessages(data)
    setLoading(false)
  }

  const markRead = async (id) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteMessage = async (id) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
    setSelected(null)
  }

  const filtered = filter === 'unread' ? messages.filter(m => !m.read) : messages
  const unreadCount = messages.filter(m => !m.read).length

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gold)' }}>Loading messages...</div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '20px' }}>
      {/* Messages list */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['all', 'All Messages'], ['unread', `Unread (${unreadCount})`]].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding: '8px 18px', border: '1px solid', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: filter === val ? 'var(--gold)' : 'transparent', color: filter === val ? 'var(--black)' : 'rgba(250,248,243,0.4)', borderColor: filter === val ? 'var(--gold)' : 'rgba(201,168,76,0.2)', transition: 'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={fetchMessages} style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)', background: 'transparent', border: '1px solid rgba(250,248,243,0.1)', padding: '8px 16px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>↻ Refresh</button>
        </div>

        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>
              {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
            </div>
          )}
          {filtered.map((msg, i) => (
            <div key={msg.id} onClick={() => { setSelected(msg); if (!msg.read) markRead(msg.id) }}
              style={{ padding: '18px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', cursor: 'pointer', background: selected?.id === msg.id ? 'rgba(201,168,76,0.06)' : !msg.read ? 'rgba(201,168,76,0.02)' : 'transparent', borderLeft: !msg.read ? '3px solid var(--gold)' : '3px solid transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = selected?.id === msg.id ? 'rgba(201,168,76,0.06)' : !msg.read ? 'rgba(201,168,76,0.02)' : 'transparent'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {!msg.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />}
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)', fontWeight: !msg.read ? 500 : 300 }}>{msg.name}</div>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.3)', letterSpacing: '1px' }}>
                  {new Date(msg.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)', marginBottom: '4px' }}>{msg.email}</div>
              {msg.subject && <div style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '6px' }}>{msg.subject}</div>}
              <div style={{ fontSize: '12px', color: 'rgba(250,248,243,0.35)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Message detail panel */}
      {selected && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '28px', position: 'sticky', top: '20px', maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)' }}>Message Detail</div>
            <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(250,248,243,0.4)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--cream)', marginBottom: '8px' }}>{selected.name}</div>
            <div style={{ fontSize: '13px', color: 'rgba(250,248,243,0.5)', marginBottom: '4px' }}>📧 {selected.email}</div>
            {selected.phone && <div style={{ fontSize: '13px', color: 'rgba(250,248,243,0.5)', marginBottom: '4px' }}>📱 {selected.phone}</div>}
            {selected.subject && <div style={{ marginTop: '10px', display: 'inline-block', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 12px' }}>{selected.subject}</div>}
          </div>

          <div style={{ fontSize: '13px', color: 'rgba(250,248,243,0.7)', lineHeight: 1.9, marginBottom: '28px', fontWeight: 300 }}>
            {selected.message}
          </div>

          <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.25)', marginBottom: '24px' }}>
            {new Date(selected.created_at).toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your enquiry at Angelina'}`}
              style={{ padding: '12px', background: 'var(--gold)', color: 'var(--black)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Reply via Email →
            </a>
            {selected.phone && (
              <a href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                style={{ padding: '12px', background: '#16a34a', color: '#fff', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Reply on WhatsApp →
              </a>
            )}
            <button onClick={() => deleteMessage(selected.id)}
              style={{ padding: '10px', background: 'transparent', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Delete Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
