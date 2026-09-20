import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { getPackages } from '../utils/api';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Cultural', 'Wildlife', 'Adventure', 'Cruise', 'City'];

const STATS = [
  { icon: '✈️', value: '500+',  label: 'Destinations' },
  { icon: '😊', value: '50K+', label: 'Happy Travelers' },
  { icon: '⭐', value: '4.9',  label: 'Average Rating' },
  { icon: '🏆', value: '15+',  label: 'Years Experience' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', location: 'Mumbai', text: 'The Bali trip was absolute magic. Every detail was perfectly arranged — I just had to show up and enjoy!', rating: 5, avatar: '👩' },
  { name: 'James O\'Brien', location: 'Dublin', text: 'Serengeti Safari exceeded every expectation. The guides were extraordinary, the camps were luxury, and the wildlife… breathtaking.', rating: 5, avatar: '👨' },
  { name: 'Yuki Tanaka', location: 'Tokyo', text: 'Ironically, the Japan Cultural tour showed me sides of my own country I had never explored. Absolutely worth every rupee!', rating: 5, avatar: '👩‍🦱' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [featured,    setFeatured]    = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getPackages({ limit: 6, sort: '-rating' });
        setFeatured(data.packages);
      } catch (err) {
        console.error('Failed to fetch packages', err);
      } finally {
        setLoadingPkgs(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery)     params.set('search',   searchQuery);
    if (activeCategory !== 'All') params.set('category', activeCategory);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 'var(--nav-h)',
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: .04,
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Floating decorative circles */}
        {[
          { size: 400, top: '-10%',  left: '-5%',  opacity: .06 },
          { size: 300, bottom: '-5%', right: '-5%', opacity: .05 },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s.size, height: s.size, borderRadius: '50%',
            background: 'var(--amber)', opacity: s.opacity,
            top: s.top, left: s.left, bottom: s.bottom, right: s.right,
            animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
          }} />
        ))}

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="fade-in-up">
            <span style={{
              display: 'inline-block', background: 'rgba(212,134,10,.2)',
              border: '1px solid rgba(212,134,10,.4)', color: 'var(--amber-light)',
              borderRadius: 999, padding: '6px 18px', fontSize: '.8rem',
              fontWeight: 600, letterSpacing: '.8px', textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              ✨ Discover The World With Us
            </span>

            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              color: 'var(--white)', lineHeight: 1.1,
              marginBottom: 24, fontWeight: 700,
            }}>
              Your Next Adventure<br />
              <em style={{ color: 'var(--amber-light)' }}>Awaits</em>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255,255,255,.75)', maxWidth: 560,
              margin: '0 auto 48px', lineHeight: 1.7,
            }}>
              Explore handcrafted travel experiences across the world's most breathtaking destinations.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{
              background: 'rgba(255,255,255,.97)',
              borderRadius: 'var(--r-xl)', padding: '8px 8px 8px 20px',
              display: 'flex', alignItems: 'center', gap: 8,
              maxWidth: 600, margin: '0 auto 48px',
              boxShadow: '0 24px 60px rgba(0,0,0,.3)',
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <input
                type="text"
                placeholder="Search destinations, trips..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '1rem', color: 'var(--charcoal)',
                  background: 'transparent',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--r-lg)', padding: '12px 28px' }}>
                Search
              </button>
            </form>

            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 18px', borderRadius: 999, fontSize: '.82rem',
                    fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
                    background: activeCategory === cat ? 'var(--amber)' : 'rgba(255,255,255,.12)',
                    color: 'var(--white)',
                    border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,.25)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
        }}>
          <div style={{ width: 26, height: 40, border: '2px solid rgba(255,255,255,.4)', borderRadius: 999, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: 'rgba(255,255,255,.6)', borderRadius: 999, animation: 'scroll 2s infinite' }} />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { to { transform: scale(1.15); } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }
        @keyframes scroll { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(12px); } }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STATS                                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--amber)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
            {STATS.map(({ icon, value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.6rem', marginBottom: 4 }}>{icon}</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--white)', fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
                <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.9rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FEATURED PACKAGES                                                  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-amber" style={{ marginBottom: 12 }}>🌟 Top Rated</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
              Featured Travel Packages
            </h2>
            <p style={{ color: 'var(--mid-gray)', maxWidth: 500, margin: '0 auto' }}>
              Carefully curated experiences for the discerning traveller. Every detail thought through.
            </p>
          </div>

          {loadingPkgs ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
            }}>
              {featured.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/packages" className="btn btn-outline" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              View All Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--sand)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-amber" style={{ marginBottom: 12 }}>💎 Why Wanderlust</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Travel With Confidence</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
            {[
              { icon: '🛡', title: 'Safe & Trusted',     desc: 'Licensed travel agency with 15 years of excellence and thousands of 5-star reviews.' },
              { icon: '🎯', title: 'Tailored Itineraries', desc: 'Every package is customisable to your preferences, budget, and travel style.' },
              { icon: '⚡', title: 'Easy Booking',       desc: 'Book your dream trip in minutes. Secure payment and instant confirmation.' },
              { icon: '🤝', title: '24/7 Support',       desc: 'Our travel experts are available around the clock, wherever you are in the world.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '32px 28px', textAlign: 'center', background: 'var(--white)' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 'var(--r-md)',
                  background: 'rgba(212,134,10,.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', margin: '0 auto 20px',
                }}>
                  {icon}
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: 12 }}>{title}</h4>
                <p style={{ color: 'var(--mid-gray)', fontSize: '.9rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="badge badge-amber" style={{ marginBottom: 12 }}>💬 Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>Stories From Our Travellers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {TESTIMONIALS.map(({ name, location, text, rating, avatar }) => (
              <div key={name} className="card" style={{ padding: '28px' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: 16 }}>
                  {'★'.repeat(rating)}
                </p>
                <p style={{ color: 'var(--charcoal-mid)', lineHeight: 1.7, fontSize: '.95rem', marginBottom: 24, fontStyle: 'italic' }}>
                  "{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--sand-dark)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  }}>{avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '.95rem' }}>{name}</p>
                    <p style={{ color: 'var(--mid-gray)', fontSize: '.8rem' }}>{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CTA BANNER                                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, var(--charcoal) 0%, #2c3e50 100%)',
        padding: '80px 0', textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: 16 }}>
            Ready to Start Your Adventure?
          </h2>
          <p style={{ color: 'var(--light-gray)', marginBottom: 36, fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 36px' }}>
            Join over 50,000 happy travellers and book your dream trip today.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/packages" className="btn btn-primary" style={{ padding: '15px 36px', fontSize: '1.05rem' }}>
              Explore Packages
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: '15px 36px', fontSize: '1.05rem', borderColor: 'rgba(255,255,255,.4)', color: 'var(--white)' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
