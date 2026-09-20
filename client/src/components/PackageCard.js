import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_EMOJI = {
  Adventure: '🧗',
  Beach:     '🏖',
  Cultural:  '🏛',
  Wildlife:  '🦁',
  Cruise:    '🚢',
  Mountain:  '🏔',
  City:      '🏙',
};

const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
};

const PackageCard = ({ pkg }) => {
  const {
    _id, title, location, imageUrl, price,
    duration, rating, reviewCount, category, difficulty,
  } = pkg;

  const difficultyColor = {
    Easy:     'var(--green)',
    Moderate: 'var(--amber)',
    Hard:     'var(--red)',
  }[difficulty] || 'var(--mid-gray)';

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform .5s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          loading="lazy"
        />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)',
          borderRadius: 999, padding: '4px 12px',
          color: 'var(--white)', fontSize: '.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span>{CATEGORY_EMOJI[category] || '🌍'}</span>
          {category}
        </div>
        {/* Difficulty */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)',
          borderRadius: 999, padding: '4px 12px',
          color: difficultyColor, fontSize: '.75rem', fontWeight: 700,
        }}>
          {difficulty}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Location */}
        <p style={{ fontSize: '.8rem', color: 'var(--mid-gray)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <span>📍</span> {location}
        </p>

        {/* Title */}
        <h3 style={{
          fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3,
          marginBottom: 12, fontFamily: 'Playfair Display, serif',
        }}>
          {title}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Stars rating={rating} />
          <span style={{ fontSize: '.8rem', color: 'var(--mid-gray)' }}>
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <span style={{ fontSize: '.82rem', color: 'var(--charcoal-mid)', display: 'flex', alignItems: 'center', gap: 4 }}>
            🕐 {duration}
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer: price + CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 16, borderTop: '1px solid var(--sand-dark)',
        }}>
          <div>
            <p style={{ fontSize: '.75rem', color: 'var(--mid-gray)' }}>Starting from</p>
            <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--amber-dark)', fontFamily: 'DM Sans, sans-serif' }}>
              ${price.toLocaleString()}
            </p>
          </div>
          <Link
            to={`/packages/${_id}`}
            className="btn btn-primary"
            style={{ padding: '9px 20px', fontSize: '.85rem' }}
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PackageCard;
