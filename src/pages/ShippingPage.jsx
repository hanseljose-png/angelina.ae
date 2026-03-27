import { useProductStore } from '../context/ProductStore'

export default function ShippingPage() {
  const { siteSettings } = useProductStore()
  const content = siteSettings?.shippingContent || null

  const DEFAULT = {
    title: 'Shipping & Returns',
    sections: [
      { heading: 'Free Shipping', body: 'Enjoy complimentary shipping on all orders across the UAE. Orders are processed within 1–2 business days and delivered within 3–5 business days.' },
      { heading: 'Same-Day Delivery', body: 'Available in Dubai for orders placed before 12:00 PM. A delivery charge of AED 50 applies. Contact us on WhatsApp to arrange.' },
      { heading: 'International Shipping', body: 'We ship to GCC countries (Saudi Arabia, Kuwait, Bahrain, Qatar, Oman) with a flat rate of AED 80. Delivery takes 5–7 business days.' },
      { heading: 'Returns Policy', body: 'We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Jewellery is non-returnable for hygiene reasons unless faulty.' },
      { heading: 'Exchange Policy', body: 'Exchanges are available for size or colour where stock permits. Please contact us within 7 days of receiving your order to request an exchange.' },
      { heading: 'How to Return', body: 'Email us at hello@angelina.ae with your order number and reason for return. Our team will provide you with a prepaid return label within 24 hours.' },
    ]
  }

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 60px 100px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Angelina</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 300, color: 'var(--black)', marginBottom: '16px', lineHeight: 1.1 }}>
          Shipping & <em style={{ fontStyle: 'italic', color: '#8B6914' }}>Returns</em>
        </h1>
        <div style={{ width: '60px', height: '1px', background: '#8B6914', opacity: 0.5, marginBottom: '60px' }} />
        {DEFAULT.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: i < DEFAULT.sections.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400, color: 'var(--black)', marginBottom: '12px' }}>{s.heading}</h2>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text-muted)', fontWeight: 300 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
