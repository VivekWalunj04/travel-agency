import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookingForm = ({ pkg }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    bookingDate:     '',
    travelers:       1,
    specialRequests: '',
    contactPhone:    '',
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const totalAmount = pkg.price * form.travelers;

  const validate = () => {
    const e = {};
    if (!form.bookingDate)          e.bookingDate = 'Please select a travel date';
    if (form.bookingDate < today)   e.bookingDate = 'Date must be in the future';
    if (form.travelers < 1)         e.travelers   = 'At least 1 traveler required';
    if (form.travelers > pkg.maxGroupSize)
      e.travelers = `Max group size is ${pkg.maxGroupSize}`;
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'travelers' ? parseInt(value, 10) : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      await createBooking({ packageId: pkg._id, ...form });
      toast.success('🎉 Booking confirmed! Check your dashboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--white)', borderRadius: 'var(--r-lg)',
      border: '1px solid var(--sand-dark)', padding: '28px',
      boxShadow: 'var(--shadow-md)', position: 'sticky', top: 'calc(var(--nav-h) + 20px)',
    }}>
      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', marginBottom: 4 }}>
        Book This Trip
      </h3>
      <p style={{ color: 'var(--mid-gray)', fontSize: '.85rem', marginBottom: 24 }}>
        Secure your spot today — limited availability!
      </p>

      {/* Price summary */}
      <div style={{
        background: 'var(--sand)', borderRadius: 'var(--r-md)',
        padding: '16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontSize: '.8rem', color: 'var(--mid-gray)' }}>Per person</p>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-dark)' }}>${pkg.price.toLocaleString()}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '.8rem', color: 'var(--mid-gray)' }}>Total ({form.travelers} traveler{form.travelers > 1 ? 's' : ''})</p>
          <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--charcoal)' }}>${totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Date */}
        <div className="form-group">
          <label className="form-label">Travel Date *</label>
          <input
            type="date"
            name="bookingDate"
            value={form.bookingDate}
            min={today}
            onChange={handleChange}
            className={`form-input ${errors.bookingDate ? 'error' : ''}`}
            style={errors.bookingDate ? { borderColor: 'var(--red)' } : {}}
          />
          {errors.bookingDate && <span className="form-error">{errors.bookingDate}</span>}
        </div>

        {/* Travelers */}
        <div className="form-group">
          <label className="form-label">Number of Travelers *</label>
          <input
            type="number"
            name="travelers"
            value={form.travelers}
            min={1}
            max={pkg.maxGroupSize}
            onChange={handleChange}
            className="form-input"
            style={errors.travelers ? { borderColor: 'var(--red)' } : {}}
          />
          <span style={{ fontSize: '.75rem', color: 'var(--mid-gray)' }}>
            Max group size: {pkg.maxGroupSize}
          </span>
          {errors.travelers && <span className="form-error">{errors.travelers}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">Contact Phone</label>
          <input
            type="tel"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="form-input"
          />
        </div>

        {/* Special Requests */}
        <div className="form-group">
          <label className="form-label">Special Requests</label>
          <textarea
            name="specialRequests"
            value={form.specialRequests}
            onChange={handleChange}
            placeholder="Dietary requirements, accessibility needs, anniversaries..."
            className="form-input"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Contact info (read-only) */}
        {user && (
          <div style={{
            background: 'var(--sand)', borderRadius: 'var(--r-sm)',
            padding: '12px 14px', fontSize: '.82rem', color: 'var(--charcoal-mid)',
          }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Booking as:</p>
            <p>{user.name} · {user.email}</p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
        >
          {loading ? 'Processing...' : `Confirm Booking — $${totalAmount.toLocaleString()}`}
        </button>

        <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--mid-gray)' }}>
          🔒 Secure booking · Free cancellation within 24 hours
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
