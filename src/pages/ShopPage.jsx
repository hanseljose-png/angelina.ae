import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductStore } from '../context/ProductStore'
import ProductCard from '../components/ui/ProductCard'

const categories = [
  { id: 'all', label: 'All Pieces' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'jewellery', label: 'Jewellery' },
]

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all')
  const [sortBy, setSortBy] = useState('default')
  const { products, loading } = useProductStore()

  const filtered = useMemo(() => {
    let list = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [activeCategory, sortBy, products])

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ padding: '60px 60px 40px', background: 'var(--black)', textAlign: 'center' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>Angelina Store</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '60px', fontWeight: 300, color: 'var(--cream)' }}>Our <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Collections</em></h1>
      </div>
      <div style={{ padding: '24px 60px', background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '8px 20px', border: '1px solid', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s', background: activeCategory === cat.id ? 'var(--black)' : 'transparent', color: activeCategory === cat.id ? 'var(--gold)' : 'var(--text-muted)', borderColor: activeCategory === cat.id ? 'var(--black)' : 'rgba(0,0,0,0.2)' }}>
              {cat.label}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 16px', border: '1px solid rgba(0,0,0,0.2)', background: 'transparent', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}>
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
      <div style={{ padding: '40px 60px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : (
          <>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '24px' }}>{filtered.length} pieces</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px' }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
