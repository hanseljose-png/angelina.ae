import { useState, useRef } from 'react'
import { useProductStore } from '../../context/ProductStore'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const { siteSettings, saveSettings } = useProductStore()
  const [form, setForm] = useState({ ...siteSettings })
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [uploading, setUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState(siteSettings.heroImageUrl || null)
  const fileInputRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setUploadPreview(localUrl)
    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-image.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('site-images')
        .upload(fileName, file, { upsert: true })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl
      setUploadPreview(publicUrl)
      set('heroImageUrl', publicUrl)

      // Auto save settings
      const updated = { ...form, heroImageUrl: publicUrl }
      saveSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)

    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Please make sure the storage bucket is set up in Supabase.')
    }
    setUploading(false)
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
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ width: '100%', padding: '14px 20px', border: 'none', borderLeft: activeSection === s.id ? '2px solid var(--gold)' : '2px solid transparent', background: activeSection === s.id ? 'rgba(201,168,76,0.06)' : 'transparent', color: activeSection === s.id ? 'var(--gold)' : 'rgba(250,248,243,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-sans)', display: 'block' }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)', padding: '32px' }}>

        {activeSection === 'hero' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Hero Section</div>
            <div style={{ display: 'grid', gap: '20px' }}>

              {/* HERO IMAGE UPLOAD */}
              <div>
                <label style={labelStyle}>Hero Image (right side of homepage)</label>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

                {uploadPreview ? (
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <img src={uploadPreview} alt="Hero preview"
                      style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block', border: '1px solid rgba(201,168,76,0.2)' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => fileInputRef.current.click()}
                        style={{ padding: '8px 16px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                        {uploading ? 'Uploading...' : 'Change Photo'}
                      </button>
                    </div>
                    {uploading && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ color: 'var(--gold)', fontSize: '14px', letterSpacing: '2px' }}>Uploading...</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current.click()}
                    style={{ border: '2px dashed rgba(201,168,76,0.3)', padding: '48px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', marginBottom: '12px' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}>
                    <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>📷</div>
                    <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: '8px' }}>Click to Upload Hero Photo</div>
                    <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.25)' }}>JPG, PNG or WebP — Recommended: 800×1100px portrait</div>
                  </div>
                )}
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.25)', lineHeight: 1.6 }}>
                  💡 Best results: A portrait photo of a model wearing your fashion or jewellery, with a clean or dark background.
                </div>
              </div>

              <div>
                <label style={labelStyle}>Badge Text (top of hero)</label>
                <input value={form.heroBadge || ''} onChange={e => set('heroBadge', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Main Headline</label>
                <input value={form.heroTitle || ''} onChange={e => set('heroTitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Subtitle</label>
                <input value={form.heroSubtitle || ''} onChange={e => set('heroSubtitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Hero Description</label>
                <textarea value={form.heroDesc || ''} onChange={e => set('heroDesc', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>Marquee Ticker Items (comma separated)</label>
                <input value={form.marqueeItems || ''} onChange={e => set('marqueeItems', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
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
                <div><label style={labelStyle}>Stat — Years</label><input value={form.statYears || ''} onChange={e => set('statYears', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
                <div><label style={labelStyle}>Stat — Designs</label><input value={form.statDesigns || ''} onChange={e => set('statDesigns', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'contact' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Contact Information</div>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[['contactEmail','Email Address','hello@angelina.ae'],['contactPhone','Phone / WhatsApp','+971 50 000 0000'],['contactLocation','Location','Dubai, UAE']].map(([key, label, placeholder]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input value={form[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleSave}
            style={{ padding: '13px 36px', background: saved ? '#16a34a' : 'var(--gold)', color: saved ? '#fff' : 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.4s' }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          {saved && <span style={{ fontSize: '11px', color: '#4ade80', letterSpacing: '1px' }}>Changes saved!</span>}
        </div>
      </div>
    </div>
  )
}
