import { useState } from 'react'
import { useProductStore } from '../context/ProductStore'
import { supabase } from '../lib/supabase'

export default function ContactPage() {
  const { siteSettings } = useProductStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.message.trim()) errs.message = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    try {
      await supabase.from('contact_messages').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        read: false,
        created_at: new Date().toISOString(),
      }])
    } catch (err) { console.error(err) }
    setSending(false)
    setSent(true)
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 16px',
    border: `1px solid ${errors[field] ? '#dc2626' : 'rgba(0,0,0,0.15)'}`,
    background: '#fff', fontSize: '14px', color: 'var(--black)',
    outline: 'none', fontFamily: 'var(--font-sans)', borderRadius: '0',
    transition: 'border-color 0.3s',
  })
  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 60px 100px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Get in Touch</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 300, color: 'var(--black)', marginBottom: '16px', lineHeight: 1.1 }}>
          Contact <em style={{ fontStyle: 'italic', color: '#8B6914' }}>Us</em>
        </h1>
        <div style={{ width: '60px', height: '1px', background: '#8B6914', opacity: 0.5, marginBottom: '60px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'start' }}>
          {/* Info */}
          <div>
            {[
              ['Location', siteSettings?.contactLocation || 'Dubai, UAE', null],
              ['Email', siteSettings?.contactEmail || 'hello@angelina.ae', `mailto:${siteSettings?.contactEmail || 'hello@angelina.ae'}`],
              ['WhatsApp / Phone', siteSettings?.contactPhone || '+971 50 000 0000', `tel:${(siteSettings?.contactPhone || '').replace(/\D/g,'')}`],
            ].map(([label, value, href]) => (
              <div key={label} style={{ marginBottom: '36px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '12px' }}>{label}</div>
                {href ? <a href={href} style={{ fontSize: '15px', color: 'var(--black)', fontWeight: 300, textDecoration: 'none' }}>{value}</a>
                  : <p style={{ fontSize: '15px', color: 'var(--black)', fontWeight: 300 }}>{value}</p>}
              </div>
            ))}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '12px' }}>Hours</div>
              <p style={{ fontSize: '15px', color: 'var(--black)', lineHeight: 1.8, fontWeight: 300 }}>
                {siteSettings?.hoursWeekdays || 'Saturday – Thursday, 10:00 AM – 8:00 PM'}<br />
                Friday: {siteSettings?.hoursFriday || 'Closed'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div style={{ padding: '48px', background: '#fff', textAlign: 'center', border: '1px solid rgba(139,105,20,0.2)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#16a34a' }}>✓</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--black)', marginBottom: '12px' }}>Message Sent!</div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 300, marginBottom: '24px' }}>Thank you for reaching out. Our team will be in touch within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8B6914', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle('name')}
                      onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.name ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                    {errors.name && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.name}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle('email')}
                      onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                    {errors.email && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.email}</div>}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Phone / WhatsApp</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+971 50 000 0000" style={inputStyle('phone')}
                      onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Subject</label>
                    <select value={form.subject} onChange={e => set('subject', e.target.value)} style={{ ...inputStyle('subject'), cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'}>
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
                  <label style={labelStyle}>Message *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5}
                    style={{ ...inputStyle('message'), resize: 'vertical', lineHeight: 1.7 }}
                    onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.message ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                  {errors.message && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.message}</div>}
                </div>
                <button type="submit" disabled={sending} className="btn-primary"
                  style={{ background: sending ? '#444' : 'var(--black)', color: 'var(--gold)', border: 'none', width: '100%', justifyContent: 'center' }}>
                  {sending ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
