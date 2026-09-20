import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{
    background: 'var(--charcoal)',
    color: 'var(--white)',
    padding: '64px 0 0',
  }}>
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 48,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,.1)',
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: '1.8rem' }}>✈</span>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700 }}>
              Wanderlust
            </span>
          </div>
          <p style={{ color: 'var(--light-gray)', fontSize: '.9rem', lineHeight: 1.7, maxWidth: 260 }}>
            Crafting extraordinary travel experiences since 2010. Your journey of a lifetime starts here.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {['📘','🐦','📸','▶'].map((icon, i) => (
              <button key={i} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.9rem', cursor: 'pointer', border: 'none',
                transition: 'background .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--amber)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
              >{icon}</button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: 20, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>
            Quick Links
          </h4>
          {[
            { to: '/',          label: 'Home' },
            { to: '/packages',  label: 'All Packages' },
            { to: '/dashboard', label: 'My Bookings' },
            { to: '/register',  label: 'Create Account' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              display: 'block', color: 'var(--light-gray)',
              fontSize: '.9rem', marginBottom: 12,
              transition: 'color .2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--amber-light)'}
              onMouseLeave={e => e.target.style.color = 'var(--light-gray)'}
            >{label}</Link>
          ))}
        </div>

        {/* Destinations */}
        <div>
          <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: 20, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>
            Top Destinations
          </h4>
          {['Bali, Indonesia', 'Swiss Alps', 'Rajasthan, India', 'Tokyo, Japan', 'Serengeti, Tanzania', 'Patagonia'].map(dest => (
            <p key={dest} style={{ color: 'var(--light-gray)', fontSize: '.9rem', marginBottom: 10 }}>
              📍 {dest}
            </p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'var(--white)', fontSize: '1rem', marginBottom: 20, fontFamily: 'DM Sans, sans-serif', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>
            Contact Us
          </h4>
          {[
            { icon: '📍', text: '123 Explorer Street, Mumbai, India' },
            { icon: '📞', text: '+91 98765 43210' },
            { icon: '✉️', text: 'hello@wanderlust.travel' },
            { icon: '🕐', text: 'Mon–Sat: 9 AM – 7 PM' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '.9rem', flexShrink: 0, marginTop: 2 }}>{icon}</span>
              <p style={{ color: 'var(--light-gray)', fontSize: '.9rem', lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: '24px 0',
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 12,
      }}>
        <p style={{ color: 'var(--mid-gray)', fontSize: '.85rem' }}>
          © {new Date().getFullYear()} Wanderlust Travel Agency. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#!" style={{
              color: 'var(--mid-gray)', fontSize: '.85rem', transition: 'color .2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--amber-light)'}
              onMouseLeave={e => e.target.style.color = 'var(--mid-gray)'}
            >{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
