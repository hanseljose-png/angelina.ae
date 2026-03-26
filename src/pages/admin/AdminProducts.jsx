import { useState } from 'react'
import { useProductStore } from '../../context/ProductStore'

const EMPTY = { name: '', category: 'fashion', price: '', oldPrice: '', badge: '', description: '', material: '', origin: '', sizes: '' }

const BADGE_COLORS = { New: 'var(--gold)', Bestseller: '#1d4ed8', Sale: '#dc2626', '': '#666' }

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()
  const [editing, setEditing] = useState(null)       // product being edited
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saved, setSaved] = useState(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (p) => { setEditing(p.id); setAdding(false); setForm({ ...p, sizes: Array.isArray(p.sizes) ? p.sizes.join(',') : (p.sizes || '') }) }
  const openAdd = () => { setAdding(true); setEditing(null); setForm(EMPTY) }
  const cancel = () => { setEditing(null); setAdding(false); setForm(EMPTY) }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    const data = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
    }
    if (adding) addProduct(data)
    else updateProduct(editing, data)
    setSaved(editing || 'new')
    setTimeout(() => setSaved(null), 2000)
    cancel()
  }

  const confirmDelete = (id) => setDeleteConfirm(id)
  const doDelete = () => { deleteProduct(deleteConfirm); setDeleteConfirm(null) }

  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.35)', marginBottom: '8px' }
  const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', color: 'var(--cream)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)', borderRadius: '2px' }
  const inputFocus = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'
  const inputBlur = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.15)'

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ ...inputStyle, width: '300px' }} onFocus={inputFocus} onBlur={inputBlur} />
        <button onClick={openAdd}
          style={{ padding: '11px 28px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          + Add Product
        </button>
      </div>

      {/* ADD/EDIT FORM */}
      {(adding || editing !== null) && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>
            {adding ? '+ Add New Product' : '✎ Edit Product'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Silk Evening Gown" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="fashion">Fashion</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Price (AED) *</label>
              <input value={form.price} onChange={e => set('price', e.target.value)} type="number" placeholder="2450" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={labelStyle}>Original Price (AED) — for Sale badge</label>
              <input value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value)} type="number" placeholder="Optional — e.g. 3200" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={labelStyle}>Badge</label>
              <select value={form.badge || ''} onChange={e => set('badge', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sizes (comma separated) — leave blank for jewellery</label>
              <input value={form.sizes || ''} onChange={e => set('sizes', e.target.value)} placeholder="XS,S,M,L,XL or 5,6,7,8" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={labelStyle}>Material</label>
              <input value={form.material || ''} onChange={e => set('material', e.target.value)} placeholder="e.g. Pure Silk" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
            <div>
              <label style={labelStyle}>Origin / Country</label>
              <input value={form.origin || ''} onChange={e => set('origin', e.target.value)} placeholder="e.g. UAE, Italy, France" style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Product Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the product in detail..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          {/* Image Upload placeholder */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Product Image</label>
            <div style={{ border: '2px dashed rgba(201,168,76,0.2)', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'}>
              <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.4 }}>📷</div>
              <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)', marginBottom: '6px' }}>Drop image here or click to upload</div>
              <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.2)' }}>JPG, PNG, WebP — Max 5MB</div>
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { if(e.target.files[0]) set('imageFile', e.target.files[0].name) }} />
            </div>
            {form.imageFile && <div style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '8px' }}>✓ {form.imageFile}</div>}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave}
              style={{ padding: '13px 36px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              {adding ? 'Add Product' : 'Save Changes'}
            </button>
            <button onClick={cancel}
              style={{ padding: '13px 24px', background: 'transparent', color: 'rgba(250,248,243,0.4)', border: '1px solid rgba(250,248,243,0.15)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px 100px 140px', padding: '14px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)' }}>
          <span>Product</span><span>Category</span><span>Price (AED)</span><span>Badge</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>No products found.</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px 100px 140px', padding: '18px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', alignItems: 'center', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)', marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)' }}>{p.material || '—'}</div>
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.45)' }}>{p.category}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cream)' }}>
              {p.price?.toLocaleString()}
              {p.oldPrice && <div style={{ fontSize: '10px', color: '#777', textDecoration: 'line-through' }}>{p.oldPrice?.toLocaleString()}</div>}
            </div>
            <div>
              {p.badge ? (
                <span style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 10px', background: p.badge === 'Sale' ? 'rgba(220,38,38,0.15)' : p.badge === 'Bestseller' ? 'rgba(29,78,216,0.15)' : 'rgba(201,168,76,0.15)', color: p.badge === 'Sale' ? '#f87171' : p.badge === 'Bestseller' ? '#93c5fd' : 'var(--gold)', fontWeight: 600 }}>{p.badge}</span>
              ) : <span style={{ fontSize: '11px', color: 'rgba(250,248,243,0.2)' }}>—</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => openEdit(p)}
                style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(201,168,76,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Edit
              </button>
              <button onClick={() => confirmDelete(p.id)}
                style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.target.style.background = 'rgba(220,38,38,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', padding: '48px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--cream)', marginBottom: '12px' }}>Delete Product?</div>
            <div style={{ fontSize: '13px', color: 'rgba(250,248,243,0.4)', marginBottom: '32px' }}>
              {products.find(p => p.id === deleteConfirm)?.name} will be permanently removed.
            </div>
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
