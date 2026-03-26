import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
    padding: '20px 60px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: scrolled ? 'rgba(10,10,10,0.97)' : 'linear-gradient(to bottom, rgba(10,10,10,0.9), transparent)',
    borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
    transition: 'all 0.4s',
  }

  const linkStyle = {
    fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
    color: 'var(--cream)', fontWeight: 400, transition: 'color 0.3s',
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 300, letterSpacing: '8px', color: 'var(--gold)', textTransform: 'uppercase' }}>
        Angelina
      </Link>

      <ul style={{ display: 'flex', gap: '36px', listStyle: 'none' }}>
        {[['/', 'Home'], ['/shop', 'Shop'], ['/shop?cat=fashion', 'Fashion'], ['/shop?cat=jewellery', 'Jewellery'], ['/about', 'About']].map(([path, label]) => (
          <li key={path}>
            <Link to={path} style={{ ...linkStyle, color: location.pathname === path ? 'var(--gold)' : 'var(--cream)' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = location.pathname === path ? 'var(--gold)' : 'var(--cream)'}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/cart" style={{ position: 'relative', color: 'var(--cream)', fontSize: '18px' }}>
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
