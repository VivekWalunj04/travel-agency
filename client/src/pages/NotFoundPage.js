import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh', paddingTop: 'var(--nav-h)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--sand)', textAlign: 'center', padding: '40px 20px',
  }}>
    <div>
      <p style={{ fontSize: '6rem', lineHeight: 1, marginBottom: 24 }}>🗺️</p>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--charcoal)', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Destination Not Found</h2>
      <p style={{ color: 'var(--mid-gray)', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7 }}>
        Looks like you've wandered off the map! The page you're looking for doesn't exist.
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '13px 28px' }}>Back to Home</Link>
        <Link to="/packages" className="btn btn-outline" style={{ padding: '13px 28px' }}>Browse Packages</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
