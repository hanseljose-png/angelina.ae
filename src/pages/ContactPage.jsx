import { useState } from 'react'
import { useProductStore } from '../context/ProductStore'

export default function ContactPage() {
  const { siteSettings } = useProductStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle = { width: '100%', padding: '14px 16px', border: '1px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: '14px', color: 'var(--black)', outline: 'none', fontFamily: 'var(--font-sans)', transition: 'border-color 0.3s', borderRadius: '0' }

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 60px 100px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Get in Touch</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 300, color: 'var(--black)', marginBottom: '16px', lineHeight: 1.1 }}>
          Contact <em style={{ fontStyle: 'italic', color: '#8B6914' }}>Us</em>
        </h1>
        <div style={{ width: '60px', height: '1px', background: '#8B6914', opacity: 0.5, marginBottom: '60px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'start' }}>
          {/* Contact Info */}
          <div>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Location</div>
              <p style={{ fontSize: '15px', color: 'var(--black)', lineHeight: 1.7, fontWeight: 300 }}>{siteSettings?.contactLocation || 'Dubai, UAE'}</p>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Email</div>
              <a href={`mailto:${siteSettings?.contactEmail || 'hello@angelina.ae'}`} style={{ fontSize: '15px', color: 'var(--black)', fontWeight: 300, textDecoration: 'none' }}>{siteSettings?.contactEmail || 'hello@angelina.ae'}</a>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>WhatsApp / Phone</div>
              <a href={`tel:${siteSettings?.contactPhone || '+971500000000'}`} style={{ fontSize: '15px', color: 'var(--black)', fontWeight: 300, textDecoration: 'none' }}>{siteSettings?.contactPhone || '+971 50 000 0000'}</a>
            </div>
            <div>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Hours</div>
              <p style={{ fontSize: '15px', color: 'var(--black)', lineHeight: 1.8, fontWeight: 300 }}>
                Saturday – Thursday<br />10:00 AM – 8:00 PM<br /><br />
                Friday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {sent ? (
              <div style={{ padding: '48px', background: '#fff', textAlign: 'center', border: '1px solid rgba(139,105,20,0.2)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✓</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--black)', marginBottom: '12px' }}>Message Sent</div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300 }}>Thank you for reaching out. Our team will be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Full Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Phone</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Subject</label>
                    <select value={form.subject} onChange={e => set('subject', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select topic</option>
                      <option>Order Enquiry</option>
                      <option>Product Question</option>
                      <option>Returns & Exchange</option>
                      <option>Custom Order</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Message *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} required rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
                </div>
                <button type="submit" className="btn-primary" style={{ background: 'var(--black)', color: '#C9A84C', border: 'none', width: '100%', justifyContent: 'center' }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
