import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    padding: '20px 60px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: scrolled ? 'rgba(10,10,10,0.97)' : 'linear-gradient(to bottom, rgba(10,10,10,0.9), transparent)',
    borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
    transition: 'all 0.4s',
  }

  const isActive = (path) => location.pathname === path || location.search.includes(path.split('?')[1] || '___')

  const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Fashion', to: '/shop?cat=fashion' },
    { label: 'Jewellery', to: '/shop?cat=jewellery' },
    { label: 'About', to: '/about' },
  ]

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, letterSpacing: '8px', color: 'var(--gold)', textTransform: 'uppercase' }}>
        Angelina
      </Link>

      <ul style={{ display: 'flex', gap: '36px', listStyle: 'none' }}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <Link to={to}
              style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: location.pathname + location.search === to ? 'var(--gold)' : 'var(--cream)', fontWeight: 400, transition: 'color 0.3s', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = location.pathname + location.search === to ? 'var(--gold)' : 'var(--cream)'}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/cart" style={{ position: 'relative', color: 'var(--cream)', fontSize: '18px', textDecoration: 'none' }}>
          ◻
          {count > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--gold)', color: 'var(--black)', fontSize: '9px', fontWeight: 700, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
