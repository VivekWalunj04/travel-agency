import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../utils/api';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'var(--amber)',  badge: 'badge-amber' },
  confirmed: { label: 'Confirmed', color: 'var(--green)',  badge: 'badge-green' },
  cancelled: { label: 'Cancelled', color: 'var(--red)',    badge: 'badge-red'   },
  completed: { label: 'Completed', color: 'var(--blue)',   badge: 'badge-blue'  },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings,   setBookings]  = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!user) return;
    getUserBookings(user._id)
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    spent:     bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0),
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--sand)' }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>My Dashboard</h1>
            <p style={{ color: 'var(--mid-gray)' }}>Welcome back, {user?.name}! 👋</p>
          </div>
          <Link to="/packages" className="btn btn-primary">+ Book New Trip</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { icon: '✈️', label: 'Total Bookings', value: stats.total },
            { icon: '✅', label: 'Confirmed',      value: stats.confirmed },
            { icon: '⏳', label: 'Pending',        value: stats.pending },
            { icon: '💰', label: 'Total Spent',    value: `$${stats.spent.toLocaleString()}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-dark)', fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
              <p style={{ color: 'var(--mid-gray)', fontSize: '.85rem' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--sand-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>My Bookings</h3>
            <span style={{ color: 'var(--mid-gray)', fontSize: '.875rem' }}>{bookings.length} total</span>
          </div>

          {loading ? (
            <div className="loading-center" style={{ padding: '60px 0' }}><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '3rem', marginBottom: 16 }}>✈️</p>
              <h3 style={{ marginBottom: 8 }}>No bookings yet</h3>
              <p style={{ color: 'var(--mid-gray)', marginBottom: 24 }}>Start your adventure today!</p>
              <Link to="/packages" className="btn btn-primary">Browse Packages</Link>
            </div>
          ) : (
            <div>
              {bookings.map((booking, i) => {
                const { label, badge } = STATUS_CONFIG[booking.status] || {};
                return (
                  <div key={booking._id} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    gap: 20, alignItems: 'center',
                    padding: '20px 24px',
                    borderBottom: i < bookings.length - 1 ? '1px solid var(--sand-dark)' : 'none',
                    transition: 'background .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Image */}
                    <img
                      src={booking.package?.imageUrl}
                      alt={booking.package?.title}
                      style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--r-sm)' }}
                    />

                    {/* Info */}
                    <div>
                      <Link to={`/packages/${booking.package?._id}`} style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--charcoal)', display: 'block', marginBottom: 4 }}>
                        {booking.package?.title}
                      </Link>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--mid-gray)', fontSize: '.8rem' }}>
                        <span>📍 {booking.package?.location}</span>
                        <span>📅 {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span>👥 {booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
                        <span style={{ fontWeight: 700, color: 'var(--amber-dark)' }}>
                          ${booking.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <span className={`badge ${badge}`}>{label}</span>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          style={{
                            fontSize: '.75rem', color: 'var(--red)', background: 'none',
                            border: '1px solid rgba(229,62,62,.3)', borderRadius: 'var(--r-sm)',
                            padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
                          }}
                        >
                          {cancelling === booking._id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="card" style={{ padding: '28px', marginTop: 28 }}>
          <h3 style={{ marginBottom: 20 }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { label: 'Full Name',  value: user?.name },
              { label: 'Email',     value: user?.email },
              { label: 'Role',      value: user?.role === 'admin' ? '👑 Admin' : '👤 User' },
              { label: 'Member Since', value: user?._id ? 'Active Member' : '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '.75rem', color: 'var(--mid-gray)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 }}>{label}</p>
                <p style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
