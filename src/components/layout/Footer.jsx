import { Link } from 'react-router-dom'
import { useProductStore } from '../../context/ProductStore'

export default function Footer() {
  const { siteSettings } = useProductStore()

  return (
    <footer style={{ background: '#050505', padding: '60px 60px 30px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px', marginBottom: '50px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', letterSpacing: '6px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '16px' }}>Angelina</div>
          <p style={{ fontSize: '12px', lineHeight: 1.8, color: 'rgba(250,248,243,0.35)', fontWeight: 300 }}>
            Luxury fashion and fine jewellery, crafted for the modern UAE woman. Based in {siteSettings?.contactLocation || 'Dubai'}, delivering elegance across the Emirates.
          </p>
        </div>
        {[
          { title: 'Collections', links: [['Shop All', '/shop'], ['Fashion', '/shop?cat=fashion'], ['Jewellery', '/shop?cat=jewellery'], ['New Arrivals', '/shop']] },
          { title: 'Information', links: [['About Us', '/about'], ['Shipping & Returns', '/'], ['Size Guide', '/'], ['Contact Us', '/']] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>{col.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.links.map(([label, path]) => (
                <li key={label}><Link to={path} style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontWeight: 300 }}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Contact</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontWeight: 300 }}>{siteSettings?.contactLocation || 'Dubai, UAE'}</li>
            <li style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontWeight: 300 }}>{siteSettings?.contactEmail || 'hello@angelina.ae'}</li>
            <li style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontWeight: 300 }}>{siteSettings?.contactPhone || '+971 50 000 0000'}</li>
          </ul>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '10px', color: 'rgba(250,248,243,0.2)', letterSpacing: '2px' }}>© 2025 Angelina. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['IG', 'TW', 'IN'].map(s => (
            <a key={s} href="#" style={{ width: '34px', height: '34px', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'rgba(250,248,243,0.4)', letterSpacing: '1px' }}>{s}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
