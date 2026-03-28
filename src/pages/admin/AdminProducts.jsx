import { useState, useRef } from 'react'
import { useProductStore } from '../../context/ProductStore'
import { supabase } from '../../lib/supabase'

const EMPTY = { name: '', category: 'fashion', price: '', oldPrice: '', badge: '', description: '', material: '', origin: '', sizes: '', image_url: '', stock: '' }

const BG_COLORS = {
  fashion: 'linear-gradient(160deg,#f0e8d0,#e8d5a3)',
  jewellery: 'linear-gradient(160deg,#1a1a1a,#2d2d2d)',
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProductStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const fileInputRef = useRef()

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (p) => {
    setEditing(p.id)
    setAdding(false)
    setForm({ ...p, sizes: Array.isArray(p.sizes) ? p.sizes.join(',') : (p.sizes || ''), oldPrice: p.old_price || p.oldPrice || '', stock: p.stock ?? '' })
    setImgPreview(p.image_url || null)
  }
  const openAdd = () => { setAdding(true); setEditing(null); setForm(EMPTY); setImgPreview(null) }
  const cancel = () => { setEditing(null); setAdding(false); setForm(EMPTY); setImgPreview(null) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgPreview(URL.createObjectURL(file))
    setUploadingImg(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `product-${Date.now()}.${fileExt}`
      const { error } = await supabase.storage.from('site-images').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(fileName)
      setImgPreview(urlData.publicUrl)
      set('image_url', urlData.publicUrl)
    } catch (err) {
      alert('Upload failed.')
    }
    setUploadingImg(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const data = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: form.stock !== '' ? Number(form.stock) : 0,
    }
    if (adding) await addProduct(data)
    else await updateProduct(editing, data)
    setSaving(false)
    cancel()
  }

  const doDelete = async () => { await deleteProduct(deleteConfirm); setDeleteConfirm(null) }

  // Quick stock update directly from table
  const quickStockUpdate = async (id, newStock) => {
    const val = Math.max(0, Number(newStock))
    await supabase.from('products').update({ stock: val }).eq('id', id)
    // Refresh in store
    await updateProduct(id, { ...products.find(p => p.id === id), stock: val })
  }

  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.35)', marginBottom: '8px' }
  const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', color: 'var(--cream)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)', borderRadius: '2px' }
  const focus = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'
  const blur = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.15)'

  const stockColor = (s) => {
    if (s === 0) return { color: '#f87171', bg: 'rgba(220,38,38,0.1)' }
    if (s <= 3) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' }
    return { color: '#4ade80', bg: 'rgba(74,222,128,0.1)' }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gold)' }}>Loading products...</div>

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ ...inputStyle, width: '300px' }} onFocus={focus} onBlur={blur} />
        <button onClick={openAdd} style={{ padding: '11px 28px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          + Add Product
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      {(adding || editing !== null) && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>
            {adding ? '+ Add New Product' : '✎ Edit Product'}
          </div>

          {/* IMAGE UPLOAD */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Product Image</label>
            <div style={{ display: 'grid', gridTemplateColumns: imgPreview ? '160px 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
              {imgPreview && (
                <div style={{ position: 'relative' }}>
                  <img src={imgPreview} alt="Product" style={{ width: '160px', height: '200px', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.2)' }} />
                  {uploadingImg && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontSize: '11px' }}>Uploading...</div>}
                </div>
              )}
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                <div onClick={() => fileInputRef.current.click()}
                  style={{ border: '2px dashed rgba(201,168,76,0.25)', padding: imgPreview ? '24px' : '36px', textAlign: 'center', cursor: 'pointer', height: imgPreview ? 'auto' : '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}>
                  <div style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.4 }}>📷</div>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)' }}>{imgPreview ? 'Click to change photo' : 'Click to upload product photo'}</div>
                </div>
                {imgPreview && <button onClick={() => { setImgPreview(null); set('image_url', '') }} style={{ marginTop: '8px', padding: '6px 16px', background: 'transparent', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Remove Image</button>}
              </div>
            </div>
          </div>

          {/* PRODUCT FIELDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><label style={labelStyle}>Product Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="fashion">Fashion</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>
            <div><label style={labelStyle}>Price (AED) *</label><input value={form.price} onChange={e => set('price', e.target.value)} type="number" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Original Price (AED) — for Sale badge</label><input value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value)} type="number" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Badge</label>
              <select value={form.badge || ''} onChange={e => set('badge', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Sale">Sale</option>
              </select>
            </div>

            {/* STOCK FIELD */}
            <div>
              <label style={labelStyle}>Stock Quantity *</label>
              <input value={form.stock} onChange={e => set('stock', e.target.value)} type="number" min="0" placeholder="e.g. 10"
                style={{ ...inputStyle, borderColor: form.stock === '0' || form.stock === 0 ? 'rgba(220,38,38,0.4)' : 'rgba(201,168,76,0.15)' }}
                onFocus={focus} onBlur={blur} />
              {(form.stock === '0' || form.stock === 0) && (
                <div style={{ fontSize: '11px', color: '#f87171', marginTop: '4px' }}>⚠ Stock is zero — product will show as Out of Stock</div>
              )}
            </div>

            <div><label style={labelStyle}>Sizes (comma separated)</label><input value={form.sizes || ''} onChange={e => set('sizes', e.target.value)} placeholder="XS,S,M,L,XL" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Material</label><input value={form.material || ''} onChange={e => set('material', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Origin</label><input value={form.origin || ''} onChange={e => set('origin', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave} disabled={saving || uploadingImg}
              style={{ padding: '13px 36px', background: saving ? '#444' : 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
              {saving ? 'Saving...' : adding ? 'Add Product' : 'Save Changes'}
            </button>
            <button onClick={cancel} style={{ padding: '13px 24px', background: 'transparent', color: 'rgba(250,248,243,0.4)', border: '1px solid rgba(250,248,243,0.15)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 100px 120px 120px 140px', padding: '14px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)' }}>
          <span>Photo</span><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Badge</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {filtered.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,243,0.2)' }}>No products found.</div>}

        {filtered.map((p, i) => {
          const sc = stockColor(p.stock ?? 0)
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 100px 120px 120px 140px', padding: '16px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

              {/* Thumbnail */}
              <div style={{ width: '44px', height: '52px', overflow: 'hidden', background: BG_COLORS[p.category] || BG_COLORS.fashion, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '20px', opacity: 0.3 }}>{p.category === 'jewellery' ? '💎' : '👗'}</span>}
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)', marginBottom: '2px' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)' }}>{p.material || '—'}</div>
              </div>

              <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.45)' }}>{p.category}</div>

              <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cream)' }}>
                {p.price?.toLocaleString()}
                {(p.old_price || p.oldPrice) && <div style={{ fontSize: '10px', color: '#777', textDecoration: 'line-through' }}>{(p.old_price || p.oldPrice)?.toLocaleString()}</div>}
              </div>

              {/* Stock — inline editable */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ padding: '4px 10px', borderRadius: '12px', background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>
                  {p.stock ?? 0}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button onClick={() => quickStockUpdate(p.id, (p.stock ?? 0) + 1)}
                    style={{ width: '18px', height: '14px', background: 'rgba(201,168,76,0.1)', border: 'none', color: 'var(--gold)', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>▲</button>
                  <button onClick={() => quickStockUpdate(p.id, (p.stock ?? 0) - 1)}
                    style={{ width: '18px', height: '14px', background: 'rgba(220,38,38,0.1)', border: 'none', color: '#f87171', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>▼</button>
                </div>
              </div>

              <div>
                {p.badge
                  ? <span style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 10px', background: p.badge === 'Sale' ? 'rgba(220,38,38,0.15)' : 'rgba(201,168,76,0.15)', color: p.badge === 'Sale' ? '#f87171' : 'var(--gold)', fontWeight: 600 }}>{p.badge}</span>
                  : <span style={{ fontSize: '11px', color: 'rgba(250,248,243,0.2)' }}>—</span>}
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => openEdit(p)} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
                <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontSize: '9px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', padding: '48px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--cream)', marginBottom: '12px' }}>Delete Product?</div>
            <div style={{ fontSize: '13px', color: 'rgba(250,248,243,0.4)', marginBottom: '32px' }}>{products.find(p => p.id === deleteConfirm)?.name} will be permanently removed.</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={doDelete} style={{ padding: '12px 28px', background: '#dc2626', border: 'none', color: '#fff', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '12px 28px', background: 'transparent', border: '1px solid rgba(250,248,243,0.15)', color: 'rgba(250,248,243,0.5)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
