import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const CITIES = ['Abu Dhabi','Dubai','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah','Al Ain','Other']

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=info, 2=confirm, 3=success
  const [placing, setPlacing] = useState(false)
  const [orderNum, setOrderNum] = useState('')

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: 'Dubai', notes: ''
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.length < 9) errs.phone = 'Valid phone required'
    if (!form.address.trim()) errs.address = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => { if (validate()) setStep(2) }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    const num = 'ANG-' + Date.now().toString().slice(-6)
    setOrderNum(num)
    try {
      // Reduce stock for each item
      for (const item of items) {
        const newStock = Math.max(0, (item.stock ?? 0) - item.qty)
        await supabase.from('products').update({ stock: newStock }).eq('id', item.id)
      }
      await supabase.from('orders').insert([{
        order_number: num,
        customer_name: `${form.firstName} ${form.lastName}`,
        customer_email: form.email,
        customer_phone: form.phone,
        delivery_address: form.address,
        delivery_city: form.city,
        notes: form.notes,
        payment_method: 'Cash on Delivery',
        total_amount: total,
        status: 'pending',
        items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))),
        created_at: new Date().toISOString(),
      }])
    } catch (e) { console.error(e) }
    clearCart()
    setPlacing(false)
    setStep(3)
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 16px',
    border: `1px solid ${errors[field] ? '#dc2626' : 'rgba(0,0,0,0.15)'}`,
    background: '#fff', fontSize: '14px', color: 'var(--black)',
    outline: 'none', fontFamily: 'var(--font-sans)', borderRadius: '0',
  })
  const labelStyle = { display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }

  if (items.length === 0 && step !== 3) return (
    <main style={{ paddingTop: '160px', minHeight: '100vh', background: 'var(--cream)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--black)', marginBottom: '16px' }}>Your cart is empty</div>
      <Link to="/shop" className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)' }}>Continue Shopping →</Link>
    </main>
  )

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ padding: '40px 60px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Steps indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            {['Delivery Details', 'Confirm Order'].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= i + 1 ? 'var(--black)' : 'rgba(0,0,0,0.1)', color: step >= i + 1 ? 'var(--gold)' : 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>{i + 1}</div>
                  <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: step >= i + 1 ? 'var(--black)' : 'rgba(0,0,0,0.3)', fontWeight: step === i + 1 ? 600 : 300 }}>{s}</span>
                </div>
                {i === 0 && <div style={{ width: '40px', height: '1px', background: 'rgba(0,0,0,0.15)' }} />}
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 — Customer Info */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 300, color: 'var(--black)', marginBottom: '32px' }}>Delivery <em style={{ color: '#8B6914', fontStyle: 'italic' }}>Details</em></h1>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input value={form.firstName} onChange={e => set('firstName', e.target.value)} style={inputStyle('firstName')}
                    onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.firstName ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                  {errors.firstName && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.firstName}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input value={form.lastName} onChange={e => set('lastName', e.target.value)} style={inputStyle('lastName')}
                    onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.lastName ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                  {errors.lastName && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.lastName}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle('email')}
                    onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.email ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                  {errors.email && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.email}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+971 50 000 0000" style={inputStyle('phone')}
                    onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.phone ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                  {errors.phone && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.phone}</div>}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Delivery Address *</label>
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, Building, Apartment number" style={inputStyle('address')}
                  onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = errors.address ? '#dc2626' : 'rgba(0,0,0,0.15)'} />
                {errors.address && <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{errors.address}</div>}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>City / Emirate *</label>
                <select value={form.city} onChange={e => set('city', e.target.value)} style={{ ...inputStyle('city'), cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Order Notes (optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Special delivery instructions, preferred time, etc." style={{ ...inputStyle('notes'), resize: 'vertical', lineHeight: 1.7 }}
                  onFocus={e => e.target.style.borderColor = '#8B6914'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.15)'} />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Payment Method</label>
                <div style={{ border: '2px solid var(--black)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C9A84C' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--black)' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Pay when your order arrives</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '20px' }}>💵</div>
                </div>
              </div>

              <button onClick={handleContinue} className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)', border: 'none', width: '100%', justifyContent: 'center', fontSize: '11px' }}>
                Continue to Confirm →
              </button>
            </div>

            {/* Order Summary sidebar */}
            <div style={{ background: 'var(--black)', padding: '32px', position: 'sticky', top: '100px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Order Summary</div>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--cream)', marginBottom: '2px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cream)' }}>AED {(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.6)' }}>Subtotal</span>
                <span style={{ fontSize: '13px', color: 'var(--cream)' }}>AED {total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(250,248,243,0.6)' }}>Shipping</span>
                <span style={{ fontSize: '13px', color: 'var(--gold)' }}>Free</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--cream)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--gold)' }}>AED {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Confirm */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 300, color: 'var(--black)', marginBottom: '32px' }}>Confirm <em style={{ color: '#8B6914', fontStyle: 'italic' }}>Order</em></h1>

              {/* Customer details summary */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '24px', marginBottom: '20px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Delivery To</div>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--black)', marginBottom: '4px' }}>{form.firstName} {form.lastName}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {form.address}, {form.city}<br />
                  {form.phone}<br />
                  {form.email}
                </div>
                {form.notes && <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Note: {form.notes}</div>}
                <button onClick={() => setStep(1)} style={{ marginTop: '16px', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#8B6914', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-sans)' }}>Edit</button>
              </div>

              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '24px', marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>Payment</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>💵</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--black)' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pay AED {total.toLocaleString()} when your order arrives</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary"
                  style={{ background: placing ? '#444' : 'var(--black)', color: 'var(--gold)', border: 'none', flex: 1, justifyContent: 'center' }}>
                  {placing ? 'Placing Order...' : 'Place Order →'}
                </button>
                <button onClick={() => setStep(1)} style={{ padding: '16px 24px', background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Back</button>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--black)', padding: '32px', position: 'sticky', top: '100px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Order Summary</div>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--cream)', marginBottom: '2px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(250,248,243,0.4)' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--cream)' }}>AED {(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--cream)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300, color: 'var(--gold)' }}>AED {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '60px 0', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(22,163,74,0.1)', border: '2px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: '32px' }}>✓</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 300, color: 'var(--black)', marginBottom: '12px' }}>Order <em style={{ color: '#8B6914', fontStyle: 'italic' }}>Confirmed!</em></h1>
            <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '32px' }}>Order #{orderNum}</div>
            <div style={{ background: 'rgba(139,105,20,0.06)', border: '1px solid rgba(139,105,20,0.15)', padding: '28px', marginBottom: '32px', textAlign: 'left' }}>
              <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6914', marginBottom: '16px' }}>What Happens Next</div>
              {['Our team will review your order within 1–2 hours.', 'We will call or WhatsApp you to confirm delivery details.', 'Your order will be delivered within 3–5 business days.', 'Pay in cash when the order arrives at your door.'].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#8B6914', color: '#fff', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step}</div>
                </div>
              ))}
            </div>
            <Link to="/shop" className="btn-primary" style={{ background: 'var(--black)', color: 'var(--gold)', border: 'none' }}>Continue Shopping →</Link>
          </div>
        )}
      </div>
    </main>
  )
}
