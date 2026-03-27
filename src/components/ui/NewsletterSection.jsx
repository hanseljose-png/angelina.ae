import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'exists' | 'error'

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('invalid')
      return
    }
    setStatus('loading')
    try {
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (existing) {
        setStatus('exists')
        return
      }

      const { error } = await supabase.from('newsletter_subscribers').insert([{
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
        source: 'homepage',
        active: true,
      }])

      if (error) throw error
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubscribe() }

  return (
    <section style={{ padding: '80px 60px', background: '#C9A84C', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, color: '#0A0A0A', marginBottom: '12px' }}>
        Join the Inner Circle
      </h2>
      <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', marginBottom: '40px' }}>
        Be the first to discover new collections & exclusive offers
      </p>

      {status === 'success' ? (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: '#0A0A0A', marginBottom: '4px' }}>You're in!</div>
          <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)' }}>Welcome to the Angelina Inner Circle.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', maxWidth: '480px', width: '100%' }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus(null) }}
              onKeyDown={handleKeyDown}
              placeholder="Your email address"
              style={{ flex: 1, padding: '16px 24px', border: status === 'invalid' ? '2px solid #dc2626' : 'none', background: 'rgba(0,0,0,0.12)', color: '#0A0A0A', fontFamily: 'var(--font-sans)', fontSize: '12px', outline: 'none' }}
            />
            <button onClick={handleSubscribe} disabled={status === 'loading'}
              style={{ padding: '16px 28px', background: '#0A0A0A', color: '#C9A84C', border: 'none', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', opacity: status === 'loading' ? 0.7 : 1 }}>
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>
          {status === 'exists' && <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.6)' }}>✓ This email is already subscribed!</div>}
          {status === 'invalid' && <div style={{ fontSize: '12px', color: '#7f1d1d' }}>Please enter a valid email address.</div>}
          {status === 'error' && <div style={{ fontSize: '12px', color: '#7f1d1d' }}>Something went wrong. Please try again.</div>}
        </div>
      )}
    </section>
  )
}
