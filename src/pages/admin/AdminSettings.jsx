import { useState } from 'react'
import { useProductStore } from '../../context/ProductStore'

export default function AdminSettings() {
  const { siteSettings, saveSettings } = useProductStore()
  const [form, setForm] = useState({ ...siteSettings })
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.35)', marginBottom: '8px' }
  const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', color: 'var(--cream)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)', lineHeight: 1.5, borderRadius: '2px' }
  const focus = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'
  const blur = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.15)'

  const SECTIONS = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'story', label: 'Brand Story' },
    { id: 'contact', label: 'Contact Info' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '32px', alignItems: 'start' }}>
      {/* Section nav */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ width: '100%', padding: '14px 20px', border: 'none', borderLeft: activeSection === s.id ? '2px solid var(--gold)' : '2px solid transparent', background: activeSection === s.id ? 'rgba(201,168,76,0.06)' : 'transparent', color: activeSection === s.id ? 'var(--gold)' : 'rgba(250,248,243,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', display: 'block' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '32px' }}>

        {activeSection === 'hero' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Hero Section</div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Badge Text (top of hero)</label>
                <input value={form.heroBadge || ''} onChange={e => set('heroBadge', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="New Collection 2025" />
              </div>
              <div>
                <label style={labelStyle}>Main Headline</label>
                <input value={form.heroTitle || ''} onChange={e => set('heroTitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="Where Luxury Meets Grace" />
                <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.2)', marginTop: '6px' }}>Tip: The second word will be styled in gold italic automatically.</div>
              </div>
              <div>
                <label style={labelStyle}>Subtitle (below headline)</label>
                <input value={form.heroSubtitle || ''} onChange={e => set('heroSubtitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Hero Description Paragraph</label>
                <textarea value={form.heroDesc || ''} onChange={e => set('heroDesc', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Marquee Ticker Items (comma separated)</label>
                <input value={form.marqueeItems || ''} onChange={e => set('marqueeItems', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="Luxury Fashion,Fine Jewellery,Handcrafted" />
              </div>

              {/* Hero Image Upload */}
              <div>
                <label style={labelStyle}>Hero Background Image</label>
                <div style={{ border: '2px dashed rgba(201,168,76,0.2)', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}>
                  <div style={{ fontSize: '22px', marginBottom: '8px', opacity: 0.4 }}>🖼️</div>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)' }}>Upload Hero Image</div>
                  <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.2)', marginTop: '4px' }}>Recommended: 1920×1080px JPG</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'story' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Brand Story Section</div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Story Headline</label>
                <input value={form.storyTitle || ''} onChange={e => set('storyTitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Story Body Text</label>
                <textarea value={form.storyBody || ''} onChange={e => set('storyBody', e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Stat — Years</label>
                  <input value={form.statYears || ''} onChange={e => set('statYears', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="12+" />
                </div>
                <div>
                  <label style={labelStyle}>Stat — Designs</label>
                  <input value={form.statDesigns || ''} onChange={e => set('statDesigns', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} placeholder="500+" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Story Section Image</label>
                <div style={{ border: '2px dashed rgba(201,168,76,0.2)', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}>
                  <div style={{ fontSize: '22px', marginBottom: '8px', opacity: 0.4 }}>🖼️</div>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)' }}>Upload Brand Image</div>
                  <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.2)', marginTop: '4px' }}>Recommended: 800×1100px JPG</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'contact' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Contact Information</div>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                ['contactEmail', 'Email Address', 'hello@angelina.ae'],
                ['contactPhone', 'Phone / WhatsApp', '+971 50 000 0000'],
                ['contactLocation', 'Location', 'Dubai, UAE'],
              ].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              ))}
              <div style={{ padding: '16px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', fontSize: '12px', color: 'rgba(250,248,243,0.4)', lineHeight: 1.7 }}>
                ℹ️ These values appear in the footer and contact sections of your website. Updating them here will instantly reflect across all pages.
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleSave}
            style={{ padding: '13px 36px', background: saved ? '#16a34a' : 'var(--gold)', color: saved ? '#fff' : 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.4s' }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          {saved && <span style={{ fontSize: '11px', color: '#4ade80', letterSpacing: '1px' }}>Changes saved to your website.</span>}
        </div>
      </div>
    </div>
  )
}
