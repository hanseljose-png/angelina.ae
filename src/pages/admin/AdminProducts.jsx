import { useState } from 'react'
import { useProductStore } from '../../context/ProductStore'

const EMPTY = { name: '', category: 'fashion', price: '', oldPrice: '', badge: '', description: '', material: '', origin: '', sizes: '' }

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProductStore()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const openEdit = (p) => {
    setEditing(p.id)
    setAdding(false)
    setForm({ ...p, sizes: Array.isArray(p.sizes) ? p.sizes.join(',') : (p.sizes || ''), oldPrice: p.old_price || p.oldPrice || '' })
  }
  const openAdd = () => { setAdding(true); setEditing(null); setForm(EMPTY) }
  const cancel = () => { setEditing(null); setAdding(false); setForm(EMPTY) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const data = { ...form, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : null }
    if (adding) await addProduct(data)
    else await updateProduct(editing, data)
    setSaving(false)
    cancel()
  }

  const doDelete = async () => {
    await deleteProduct(deleteConfirm)
    setDeleteConfirm(null)
  }

  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.35)', marginBottom: '8px' }
  const inputStyle = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', color: 'var(--cream)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)', borderRadius: '2px' }
  const focus = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.5)'
  const blur = (e) => e.target.style.borderColor = 'rgba(201,168,76,0.15)'

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(250,248,243,0.3)' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--gold)', marginBottom: '12px' }}>Loading products...</div>
      <div style={{ fontSize: '12px' }}>Connecting to database</div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          style={{ ...inputStyle, width: '300px' }} onFocus={focus} onBlur={blur} />
        <button onClick={openAdd} style={{ padding: '11px 28px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          + Add Product
        </button>
      </div>

      {(adding || editing !== null) && (
        <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', padding: '32px', marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '28px' }}>
            {adding ? '+ Add New Product' : '✎ Edit Product'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><label style={labelStyle}>Product Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="fashion">Fashion</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>
            <div><label style={labelStyle}>Price (AED) *</label><input value={form.price} onChange={e => set('price', e.target.value)} type="number" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Original Price (AED) — for Sale</label><input value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value)} type="number" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
            <div><label style={labelStyle}>Badge</label>
              <select value={form.badge || ''} onChange={e => set('badge', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Sale">Sale</option>
              </select>
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
            <button onClick={handleSave} disabled={saving}
              style={{ padding: '13px 36px', background: saving ? '#444' : 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
              {saving ? 'Saving...' : adding ? 'Add Product' : 'Save Changes'}
            </button>
            <button onClick={cancel} style={{ padding: '13px 24px', background: 'transparent', color: 'rgba(250,248,243,0.4)', border: '1px solid rgba(250,248,243,0.15)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px 100px 140px', padding: '14px 24px', borderBottom: '1px solid rgba(201,168,76,0.08)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.25)' }}>
          <span>Product</span><span>Category</span><span>Price (AED)</span><span>Badge</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {filtered.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(250,248,243,0.2)', fontSize: '13px' }}>No products found.</div>}
        {filtered.map((p, i) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 120px 100px 140px', padding: '18px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,168,76,0.06)' : 'none', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', color: 'var(--cream)', marginBottom: '2px' }}>{p.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.3)' }}>{p.material || '—'}</div>
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.45)' }}>{p.category}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cream)' }}>
              {p.price?.toLocaleString()}
              {(p.old_price || p.oldPrice) && <div style={{ fontSize: '10px', color: '#777', textDecoration: 'line-through' }}>{(p.old_price || p.oldPrice)?.toLocaleString()}</div>}
            </div>
            <div>
              {p.badge ? <span style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 10px', background: p.badge === 'Sale' ? 'rgba(220,38,38,0.15)' : 'rgba(201,168,76,0.15)', color: p.badge === 'Sale' ? '#f87171' : 'var(--gold)', fontWeight: 600 }}>{p.badge}</span>
              : <span style={{ fontSize: '11px', color: 'rgba(250,248,243,0.2)' }}>—</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => openEdit(p)} style={{ padding: '7px 16px', background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Edit</button>
              <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

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
