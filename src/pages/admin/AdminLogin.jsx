import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

export default function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      const ok = login(user, pass)
      if (ok) navigate('/admin')
      else { setError('Invalid username or password'); setLoading(false) }
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '420px', padding: '60px 48px', background: '#111', border: '1px solid rgba(201,168,76,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', letterSpacing: '6px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '8px' }}>Angelina</div>
          <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.3)' }}>Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)', marginBottom: '10px' }}>Username</label>
            <input value={user} onChange={e => setUser(e.target.value)} type="text" placeholder="admin"
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--cream)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-sans)' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)', marginBottom: '10px' }}>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="••••••••"
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--cream)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-sans)' }} />
          </div>
          {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', padding: '12px 16px', fontSize: '12px', color: '#f87171', marginBottom: '20px' }}>{error}</div>}
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '16px', background: 'var(--gold)', color: 'var(--black)', border: 'none', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-sans)' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: 'rgba(250,248,243,0.2)' }}>
          Default: admin / angelina2025
        </div>
      </div>
    </div>
  )
}
