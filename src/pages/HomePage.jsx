import { Link } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ui/ProductCard'

const MARQUEE_ITEMS = ['Luxury Fashion','Fine Jewellery','Handcrafted','Dubai UAE','New Arrivals','Exclusive Designs']

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0A0A0A 0%,#1a1408 40%,#0d0d0d 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
        <div style={{ position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', width: '600px', height: '600px', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 60px', maxWidth: '700px', animation: 'fadeUp 1.2s ease forwards' }}>
          <div style={{ fontSize: '10px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            New Collection 2025 <span style={{ width: '60px', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '80px', fontWeight: 300, lineHeight: 1.05, marginBottom: '12px' }}>
            Where <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Luxury</em><br />Meets Grace
          </h1>
          <p style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '40px', fontWeight: 300 }}>Fashion & Fine Jewellery — Dubai, UAE</p>
          <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(250,248,243,0.6)', maxWidth: '420px', marginBottom: '48px', fontWeight: 300 }}>
            Discover curated collections of exquisite fashion and handcrafted jewellery, designed for the woman who commands every room she enters.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-primary">Explore Collection →</Link>
            <Link to="/about" className="btn-ghost">Our Story</Link>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'rgba(250,248,243,0.3)', fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase' }}>
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom,var(--gold),transparent)', animation: 'scrollPulse 2s ease infinite' }} />
          Scroll
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: 'var(--gold)', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', animation: 'marquee 20s linear infinite' }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i}>
              <span style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--black)', fontWeight: 600, padding: '0 40px' }}>{item}</span>
              <span style={{ color: 'var(--black)', opacity: 0.4, fontSize: '14px' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <div className="section-label" style={{ color: '#8B6914' }}>Handpicked for You</div>
          <h2 className="section-title" style={{ color: 'var(--black)' }}>Featured <em>Pieces</em></h2>
          <div className="section-rule" style={{ margin: '24px auto 0' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px' }}>
          {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link to="/shop" className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)' }}>View All Products →</Link>
        </div>
      </section>

      {/* BRAND STORY */}
      <section style={{ padding: '100px 60px', background: 'var(--charcoal)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '20px', bottom: '20px', border: '1px solid rgba(201,168,76,0.2)' }} />
            <div style={{ aspectRatio: '3/4', maxHeight: '500px', background: 'linear-gradient(160deg,#1a1408,#0d0d0d)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '150px', fontWeight: 300, color: 'rgba(201,168,76,0.1)', lineHeight: 1 }}>A</div>
            </div>
          </div>
          <div>
            <div className="section-label">Our Heritage</div>
            <h2 className="section-title">Crafted with <em>Passion</em></h2>
            <div className="section-rule" />
            <p style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(250,248,243,0.55)', marginTop: '28px', fontWeight: 300 }}>
              Born in the heart of Dubai, Angelina was founded on the belief that every woman deserves to feel extraordinary. We blend traditional craftsmanship with contemporary elegance, creating pieces that transcend trends.<br /><br />
              Each garment is tailored to perfection. Each jewel is set by hand. Every detail is a testament to our commitment to excellence.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginTop: '40px', paddingTop: '40px', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              {[['12+','Years'],['500+','Designs'],['UAE','Based']].map(([num,label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: 300, color: 'var(--gold)' }}>{num}</div>
                  <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: 'var(--black)', textAlign: 'center' }}>
        <div className="section-label">Client Love</div>
        <h2 className="section-title">What They <em>Say</em></h2>
        <div className="section-rule" style={{ margin: '20px auto 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', marginTop: '60px' }}>
          {[
            { text: 'I wore the evening gown to a gala in Abu Dhabi and received compliments all night. Angelina truly understands luxury.', author: 'Fatima Al Rashidi — Dubai' },
            { text: 'The diamond necklace I received is the most beautiful piece I own. Impeccable craftsmanship and stunning presentation.', author: 'Sara Mohammed — Abu Dhabi' },
            { text: 'My bridal set from Angelina was breathtaking. Every guest asked where my jewellery was from. Forever a loyal customer.', author: 'Noura Al Mansoori — Sharjah' },
          ].map((t, i) => (
            <div key={i} style={{ background: '#111', padding: '48px 36px', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '80px', color: 'var(--gold)', opacity: 0.3, position: 'absolute', top: '16px', left: '28px', lineHeight: 1 }}>"</div>
              <div style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '2px', marginBottom: '16px' }}>★★★★★</div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontStyle: 'italic', lineHeight: 1.8, color: 'rgba(250,248,243,0.7)', marginBottom: '28px' }}>{t.text}</p>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)' }}>{t.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: '80px 60px', background: 'var(--gold)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, color: 'var(--black)', marginBottom: '12px' }}>Join the Inner Circle</h2>
        <p style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)', marginBottom: '40px' }}>Be the first to discover new collections & exclusive offers</p>
        <div style={{ display: 'flex', maxWidth: '480px', margin: '0 auto' }}>
          <input type="email" placeholder="Your email address" style={{ flex: 1, padding: '16px 24px', border: 'none', background: 'rgba(0,0,0,0.12)', color: 'var(--black)', fontFamily: 'var(--font-sans)', fontSize: '12px', outline: 'none' }} />
          <button className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)', padding: '16px 28px' }}>Subscribe</button>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scrollPulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }
      `}</style>
    </main>
  )
}
