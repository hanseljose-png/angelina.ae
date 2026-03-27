export default function SizeGuidePage() {
  const fashionSizes = [
    { size: 'XS', ae: '34', bust: '80–83', waist: '60–63', hips: '86–89' },
    { size: 'S',  ae: '36', bust: '84–87', waist: '64–67', hips: '90–93' },
    { size: 'M',  ae: '38', bust: '88–91', waist: '68–71', hips: '94–97' },
    { size: 'L',  ae: '40', bust: '92–95', waist: '72–75', hips: '98–101' },
    { size: 'XL', ae: '42', bust: '96–99', waist: '76–79', hips: '102–105' },
    { size: 'XXL',ae: '44', bust: '100–103', waist: '80–83', hips: '106–109' },
  ]
  const ringSizes = [
    { ae: '5', diameter: '15.7mm', circumference: '49.3mm' },
    { ae: '6', diameter: '16.5mm', circumference: '51.8mm' },
    { ae: '7', diameter: '17.3mm', circumference: '54.4mm' },
    { ae: '8', diameter: '18.1mm', circumference: '57.0mm' },
    { ae: '9', diameter: '18.9mm', circumference: '59.5mm' },
  ]

  const thStyle = { padding: '14px 20px', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', fontWeight: 600, textAlign: 'left', borderBottom: '2px solid rgba(139,105,20,0.2)' }
  const tdStyle = { padding: '14px 20px', fontSize: '14px', color: 'var(--black)', borderBottom: '1px solid rgba(0,0,0,0.06)', fontWeight: 300 }

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 60px 100px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Angelina</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 300, color: 'var(--black)', marginBottom: '16px', lineHeight: 1.1 }}>
          Size <em style={{ fontStyle: 'italic', color: '#8B6914' }}>Guide</em>
        </h1>
        <div style={{ width: '60px', height: '1px', background: '#8B6914', opacity: 0.5, marginBottom: '48px' }} />

        <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text-muted)', marginBottom: '48px', fontWeight: 300 }}>
          All measurements are in centimetres unless stated. If you are between sizes, we recommend sizing up for comfort. For assistance, contact our stylists at hello@angelina.ae.
        </p>

        {/* Fashion Sizes */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--black)', marginBottom: '24px' }}>Fashion Sizing</h2>
        <div style={{ overflowX: 'auto', marginBottom: '60px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: 'rgba(139,105,20,0.05)' }}>
                {['Size', 'UAE Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {fashionSizes.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(0,0,0,0.02)' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#8B6914' }}>{row.size}</td>
                  <td style={tdStyle}>{row.ae}</td>
                  <td style={tdStyle}>{row.bust}</td>
                  <td style={tdStyle}>{row.waist}</td>
                  <td style={tdStyle}>{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ring Sizes */}
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 300, color: 'var(--black)', marginBottom: '24px' }}>Ring Sizing</h2>
        <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: 'rgba(139,105,20,0.05)' }}>
                {['US Size', 'Diameter', 'Circumference'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {ringSizes.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : 'rgba(0,0,0,0.02)' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#8B6914' }}>{row.ae}</td>
                  <td style={tdStyle}>{row.diameter}</td>
                  <td style={tdStyle}>{row.circumference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(139,105,20,0.06)', border: '1px solid rgba(139,105,20,0.15)', padding: '24px 28px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#8B6914', marginBottom: '8px', letterSpacing: '1px' }}>Need help with sizing?</div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>Our personal stylists are available 7 days a week. Reach us on WhatsApp or email hello@angelina.ae and we'll help you find your perfect fit.</p>
        </div>
      </div>
    </main>
  )
}
