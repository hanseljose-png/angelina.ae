import { useState, useRef, useEffect } from 'react'
import { useProductStore } from '../../context/ProductStore'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const { siteSettings, saveSettings, fetchSettings } = useProductStore()
  const [form, setForm] = useState({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [uploading, setUploading] = useState(false)
  const [heroImages, setHeroImages] = useState([])
  const fileInputRef = useRef()

  useEffect(() => {
    if (siteSettings && Object.keys(siteSettings).length > 0) {
      setForm({ ...siteSettings })
      // Parse hero images array
      try {
        const imgs = siteSettings.heroImages ? JSON.parse(siteSettings.heroImages) : (siteSettings.heroImageUrl ? [siteSettings.heroImageUrl] : [])
        setHeroImages(imgs)
      } catch { setHeroImages([]) }
    }
  }, [siteSettings])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const updatedForm = { ...form, heroImages: JSON.stringify(heroImages) }
    await saveSettings(updatedForm)
    await fetchSettings()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const newUrls = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}-${i}.${fileExt}`
      try {
        const { error } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: true })
        if (error) throw error
        const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName)
        newUrls.push(urlData.publicUrl)
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
    const updated = [...heroImages, ...newUrls]
    setHeroImages(updated)
    const updatedForm = { ...form, heroImages: JSON.stringify(updated), heroImageUrl: updated[0] || '' }
    setForm(updatedForm)
    await saveSettings(updatedForm)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setUploading(false)
  }

  const removeImage = async (index) => {
    const updated = heroImages.filter((_, i) => i !== index)
    setHeroImages(updated)
    const updatedForm = { ...form, heroImages: JSON.stringify(updated), heroImageUrl: updated[0] || '' }
    setForm(updatedForm)
    await saveSettings(updatedForm)
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

              {/* HERO SLIDESHOW IMAGES */}
              <div>
                <label style={labelStyle}>Hero Slideshow Images (auto-rotates every 4 seconds)</label>

                {/* Current images grid */}
                {heroImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {heroImages.map((url, i) => (
                      <div key={i} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                        <img src={url} alt={`Hero ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0, transition: 'opacity 0.3s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                          <div style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px' }}>Photo {i+1}</div>
                          <button onClick={() => removeImage(i)}
                            style={{ padding: '6px 14px', background: '#dc2626', border: 'none', color: '#fff', fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                            Remove
                          </button>
                        </div>
                        {i === 0 && <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--gold)', color: 'var(--black)', fontSize: '8px', letterSpacing: '2px', padding: '3px 8px', fontWeight: 700 }}>FIRST</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                <div onClick={() => fileInputRef.current.click()}
                  style={{ border: '2px dashed rgba(201,168,76,0.3)', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}>
                  {uploading ? (
                    <div style={{ color: 'var(--gold)', fontSize: '13px', letterSpacing: '2px' }}>Uploading...</div>
                  ) : (
                    <>
                      <div style={{ fontSize: '36px', marginBottom: '10px', opacity: 0.4 }}>📷</div>
                      <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.5)', marginBottom: '6px' }}>
                        {heroImages.length > 0 ? '+ Add More Photos' : 'Upload Hero Photos'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.25)' }}>Select multiple photos at once — they will rotate every 4 seconds</div>
                    </>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)', marginTop: '8px', lineHeight: 1.6 }}>
                  💡 Tip: Upload 3–5 photos. They will smoothly fade between each other on the homepage. Recommended: portrait orientation, dark background.
                </div>
              </div>

              <div><label style={labelStyle}>Badge Text</label><input value={form.heroBadge || ''} onChange={e => set('heroBadge', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
              <div><label style={labelStyle}>Main Headline</label><input value={form.heroTitle || ''} onChange={e => set('heroTitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
              <div><label style={labelStyle}>Subtitle</label><input value={form.heroSubtitle || ''} onChange={e => set('heroSubtitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
              <div><label style={labelStyle}>Hero Description</label><textarea value={form.heroDesc || ''} onChange={e => set('heroDesc', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} /></div>
              <div><label style={labelStyle}>Marquee Items (comma separated)</label><input value={form.marqueeItems || ''} onChange={e => set('marqueeItems', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            </div>
          </>
        )}

        {activeSection === 'story' && (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>Brand Story Section</div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div><label style={labelStyle}>Story Headline</label><input value={form.storyTitle || ''} onChange={e => set('storyTitle', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
              <div><label style={labelStyle}>Story Body Text</label><textarea value={form.storyBody || ''} onChange={e => set('storyBody', e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} /></div>
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
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '13px 36px', background: saved ? '#16a34a' : saving ? '#444' : 'var(--gold)', color: saved ? '#fff' : 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.4s' }}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          {saved && <span style={{ fontSize: '11px', color: '#4ade80' }}>Saved to database!</span>}
        </div>
      </div>
    </div>
  )
}
