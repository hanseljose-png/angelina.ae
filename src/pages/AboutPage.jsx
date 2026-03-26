import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <main style={{ paddingTop: '80px', background: 'var(--black)', minHeight: '100vh' }}>
      <section style={{ padding: '80px 60px', textAlign: 'center' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Our Story</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '72px', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05, marginBottom: '32px' }}>Born in <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Dubai</em></h1>
        <p style={{ fontSize: '16px', lineHeight: 2, color: 'rgba(250,248,243,0.55)', maxWidth: '680px', margin: '0 auto 60px', fontWeight: 300 }}>
          Angelina was founded on the belief that luxury is not just about price — it is about feeling extraordinary. Every piece in our collection tells a story of craftsmanship, heritage, and modern elegance.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', maxWidth: '900px', margin: '0 auto 80px' }}>
          {[['Our Mission','To empower every woman to express her unique beauty through world-class fashion and jewellery.'],['Our Craft','Each piece is handcrafted by master artisans using only the finest materials sourced from around the world.'],['Our Promise','Complimentary gift wrapping, free shipping across UAE, and a lifetime care guarantee on all jewellery.']].map(([title, desc]) => (
            <div key={title} style={{ background: '#111', padding: '40px 32px' }}>
              <div style={{ width: '40px', height: '1px', background: 'var(--gold)', marginBottom: '24px', opacity: 0.6 }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 300, color: 'var(--cream)', marginBottom: '16px' }}>{title}</h3>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(250,248,243,0.5)', fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
        <Link to="/shop" className="btn-primary">Explore Our Collections →</Link>
      </section>
    </main>
  )
}
