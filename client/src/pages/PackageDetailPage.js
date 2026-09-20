import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { getPackageById } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Stars = ({ rating }) => (
  <span style={{ color: 'var(--amber-light)', fontSize: '1.1rem' }}>
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
  </span>
);

const PackageDetailPage = () => {
  const { id }   = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  const [pkg,     setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPackageById(id);
        setPkg(data);
      } catch {
        setError('Package not found or no longer available.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading-center" style={{ paddingTop: 'var(--nav-h)' }}><div className="spinner" /></div>;

  if (error) return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <p style={{ fontSize: '4rem' }}>😕</p>
      <h2>Oops!</h2>
      <p style={{ color: 'var(--mid-gray)' }}>{error}</p>
      <Link to="/packages" className="btn btn-primary">← Back to Packages</Link>
    </div>
  );

  const {
    title, description, imageUrl, location, country,
    price, duration, rating, reviewCount, category,
    difficulty, maxGroupSize, highlights = [],
    included = [], notIncluded = [],
  } = pkg;

  const TABS = ['overview', 'highlights', "what's included"];

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* ─── Hero Banner ─────────────────────────────────────────────────── */}
      <div style={{
        height: '60vh', minHeight: 400, position: 'relative',
        background: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.6)), url(${imageUrl}) center/cover no-repeat`,
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div className="container" style={{ paddingBottom: 48, width: '100%' }}>
          <Link to="/packages" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,.8)', fontSize: '.875rem', marginBottom: 16,
            transition: 'color .2s',
          }}>← All Packages</Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
            <span className="badge" style={{ background: 'rgba(212,134,10,.85)', color: 'var(--white)' }}>{category}</span>
            <span className="badge" style={{ background: 'rgba(0,0,0,.5)', color: 'var(--white)' }}>{difficulty}</span>
          </div>

          <h1 style={{ color: 'var(--white)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', maxWidth: 700, marginBottom: 12 }}>
            {title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 {location}{country ? `, ${country}` : ''}
            </span>
            <span style={{ color: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
              🕐 {duration}
            </span>
            <span style={{ color: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', gap: 6 }}>
              👥 Max {maxGroupSize} people
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Stars rating={rating} />
              <span style={{ color: 'rgba(255,255,255,.8)', fontSize: '.875rem' }}>
                {rating} ({reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="container section" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div>
            {/* Price bar */}
            <div style={{
              background: 'var(--sand)', borderRadius: 'var(--r-md)',
              padding: '20px 24px', marginBottom: 36,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
            }}>
              <div>
                <p style={{ fontSize: '.8rem', color: 'var(--mid-gray)' }}>Starting from</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--amber-dark)' }}>
                  ${price.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--mid-gray)', fontWeight: 400 }}>/ person</span>
                </p>
              </div>
              {!user ? (
                <Link to={`/login?redirect=/packages/${id}`} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Sign In to Book
                </Link>
              ) : (
                <a href="#booking-form" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Book Now →
                </a>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--sand-dark)', marginBottom: 28 }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 20px', fontSize: '.9rem', fontWeight: 600,
                    background: 'none', cursor: 'pointer', textTransform: 'capitalize',
                    color: activeTab === tab ? 'var(--amber-dark)' : 'var(--mid-gray)',
                    borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
                    marginBottom: '-2px', transition: 'all .2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === 'overview' && (
              <div className="fade-in-up">
                <h3 style={{ marginBottom: 16 }}>About This Trip</h3>
                <p style={{ color: 'var(--charcoal-mid)', lineHeight: 1.8, marginBottom: 28 }}>{description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                  {[
                    { icon: '📅', label: 'Duration',   value: duration },
                    { icon: '👥', label: 'Group Size', value: `Max ${maxGroupSize}` },
                    { icon: '⚡', label: 'Difficulty', value: difficulty },
                    { icon: '🏷', label: 'Category',   value: category },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{
                      background: 'var(--sand)', borderRadius: 'var(--r-md)',
                      padding: '16px', textAlign: 'center',
                    }}>
                      <p style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</p>
                      <p style={{ fontSize: '.75rem', color: 'var(--mid-gray)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</p>
                      <p style={{ fontWeight: 700, fontSize: '.9rem' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Highlights */}
            {activeTab === 'highlights' && (
              <div className="fade-in-up">
                <h3 style={{ marginBottom: 20 }}>Trip Highlights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {highlights.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '16px', background: 'var(--sand)',
                      borderRadius: 'var(--r-md)', borderLeft: '4px solid var(--amber)',
                    }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⭐</span>
                      <p style={{ color: 'var(--charcoal-mid)', lineHeight: 1.5 }}>{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: What's Included */}
            {activeTab === "what's included" && (
              <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                <div>
                  <h4 style={{ marginBottom: 16, color: 'var(--green)' }}>✅ Included</h4>
                  {included.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }}>✓</span>
                      <p style={{ color: 'var(--charcoal-mid)', fontSize: '.9rem' }}>{item}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ marginBottom: 16, color: 'var(--red)' }}>❌ Not Included</h4>
                  {notIncluded.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }}>✗</span>
                      <p style={{ color: 'var(--charcoal-mid)', fontSize: '.9rem' }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN — Booking Form */}
          <div id="booking-form">
            <BookingForm pkg={pkg} />
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 960px) {
          .container > div[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default PackageDetailPage;
