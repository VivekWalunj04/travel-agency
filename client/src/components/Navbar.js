import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--nav-h)',
      background: scrolled ? 'rgba(255,255,255,.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,.08)' : 'none',
      transition: 'all .3s ease',
      display: 'flex', alignItems: 'center',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

        {/* ─── Logo ───────────────────────────────────────────────────────── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.6rem' }}>✈</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.35rem',
            fontWeight: 700,
            color: scrolled ? 'var(--charcoal)' : 'var(--white)',
          }}>
            Wanderlust
          </span>
        </Link>

        {/* ─── Desktop Nav ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {['/', '/packages'].map((path, i) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) => ({
                fontSize: '.9rem',
                fontWeight: 500,
                color: isActive
                  ? 'var(--amber-light)'
                  : (scrolled ? 'var(--charcoal)' : 'rgba(255,255,255,.9)'),
                transition: 'color .2s',
                paddingBottom: '2px',
                borderBottom: isActive ? '2px solid var(--amber-light)' : '2px solid transparent',
              })}
            >
              {i === 0 ? 'Home' : 'Packages'}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/dashboard" style={({ isActive }) => ({
                fontSize: '.9rem', fontWeight: 500,
                color: isActive ? 'var(--amber-light)' : (scrolled ? 'var(--charcoal)' : 'rgba(255,255,255,.9)'),
                borderBottom: isActive ? '2px solid var(--amber-light)' : '2px solid transparent',
                paddingBottom: '2px',
              })}>Dashboard</NavLink>

              {isAdmin && (
                <NavLink to="/admin" style={({ isActive }) => ({
                  fontSize: '.9rem', fontWeight: 500,
                  color: isActive ? 'var(--amber-light)' : (scrolled ? 'var(--charcoal)' : 'rgba(255,255,255,.9)'),
                  borderBottom: isActive ? '2px solid var(--amber-light)' : '2px solid transparent',
                  paddingBottom: '2px',
                })}>Admin</NavLink>
              )}

              {/* Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--amber)', color: 'var(--white)',
                    border: 'none', borderRadius: 999, padding: '8px 16px',
                    fontWeight: 600, fontSize: '.85rem', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>👤</span>
                  {user.name.split(' ')[0]}
                  <span style={{ fontSize: '.7rem' }}>{profileOpen ? '▲' : '▼'}</span>
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--white)', borderRadius: 'var(--r-md)',
                    boxShadow: 'var(--shadow-lg)', minWidth: 180,
                    border: '1px solid rgba(0,0,0,.08)', overflow: 'hidden',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--sand-dark)' }}>
                      <p style={{ fontWeight: 600, fontSize: '.9rem' }}>{user.name}</p>
                      <p style={{ fontSize: '.75rem', color: 'var(--mid-gray)' }}>{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: '.875rem', color: 'var(--charcoal)' }}
                      onMouseEnter={e => e.target.style.background = 'var(--sand)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >My Bookings</Link>
                    <button onClick={handleLogout} style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 16px', fontSize: '.875rem', color: 'var(--red)',
                      background: 'transparent',
                    }}
                      onMouseEnter={e => e.target.style.background = 'var(--sand)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >Sign Out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/login" className="btn btn-ghost" style={{
                color: scrolled ? 'var(--charcoal)' : 'var(--white)',
                padding: '8px 20px',
              }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>Get Started</Link>
            </div>
          )}
        </div>

        {/* ─── Mobile Hamburger ───────────────────────────────────────────── */}
        <button onClick={() => setMenuOpen(v => !v)} style={{
          display: 'none', flexDirection: 'column', gap: 5, background: 'none',
          padding: 8,
        }} className="hamburger">
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 24, height: 2,
              background: scrolled ? 'var(--charcoal)' : 'var(--white)',
              borderRadius: 2, transition: 'all .3s',
            }} />
          ))}
        </button>
      </div>

      {/* ─── Mobile Menu ────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'var(--nav-h)', left: 0, right: 0,
          background: 'var(--white)', padding: '20px 24px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <Link to="/"         onClick={() => setMenuOpen(false)} style={{ fontWeight: 500 }}>Home</Link>
          <Link to="/packages" onClick={() => setMenuOpen(false)} style={{ fontWeight: 500 }}>Packages</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ fontWeight: 500 }}>Dashboard</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ fontWeight: 500 }}>Admin</Link>}
              <button onClick={handleLogout} style={{ textAlign: 'left', color: 'var(--red)', fontWeight: 500, background: 'none', fontSize: '1rem' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} style={{ fontWeight: 500 }}>Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary" style={{ width: 'fit-content' }}>Get Started</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
