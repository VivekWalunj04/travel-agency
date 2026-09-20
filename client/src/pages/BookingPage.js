import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { getPackageById } from '../utils/api';

const BookingPage = () => {
  const { id }    = useParams();
  const [pkg,     setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getPackageById(id)
      .then(({ data }) => setPkg(data))
      .catch(() => setError('Package not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center" style={{ paddingTop: 'var(--nav-h)' }}><div className="spinner" /></div>;
  if (error)   return (
    <div style={{ paddingTop: 'var(--nav-h)', textAlign: 'center', padding: '80px 20px' }}>
      <p>{error}</p>
      <Link to="/packages" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Packages</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 'var(--nav-h)', background: 'var(--sand)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container" style={{ paddingTop: 48 }}>
        <Link to={`/packages/${id}`} style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '.875rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Back to Package
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40, alignItems: 'start' }}>
          {/* Package summary */}
          <div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <img src={pkg.imageUrl} alt={pkg.title} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{pkg.title}</h2>
                <p style={{ color: 'var(--mid-gray)', display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16 }}>
                  📍 {pkg.location}
                </p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--charcoal-mid)', fontSize: '.875rem' }}>🕐 {pkg.duration}</span>
                  <span style={{ color: 'var(--charcoal-mid)', fontSize: '.875rem' }}>👥 Max {pkg.maxGroupSize}</span>
                  <span style={{ color: 'var(--charcoal-mid)', fontSize: '.875rem' }}>⚡ {pkg.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', marginTop: 20 }}>
              <h4 style={{ marginBottom: 16 }}>📋 Booking Policy</h4>
              {[
                '✅ Free cancellation within 24 hours of booking',
                '📅 Full payment required at time of booking',
                '🔄 Date changes permitted up to 7 days before travel',
                '🛡 Travel insurance strongly recommended',
                '📞 24/7 support via phone and email',
              ].map(item => (
                <p key={item} style={{ fontSize: '.875rem', color: 'var(--charcoal-mid)', marginBottom: 10 }}>{item}</p>
              ))}
            </div>
          </div>

          {/* Booking form */}
          <BookingForm pkg={pkg} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
