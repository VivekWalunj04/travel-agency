import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPackages, deletePackage, createPackage, updatePackage, getAllBookings, updateBookingStatus } from '../utils/api';

const CATEGORIES = ['Adventure', 'Beach', 'Cultural', 'Wildlife', 'Cruise', 'Mountain', 'City'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];

const BLANK_FORM = {
  title: '', description: '', price: '', duration: '', location: '',
  country: '', imageUrl: '', category: 'Cultural', difficulty: 'Easy',
  maxGroupSize: 15, highlights: '', included: '', notIncluded: '',
};

const AdminPage = () => {
  const [activeTab,  setActiveTab]  = useState('packages');
  const [packages,   setPackages]   = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editPkg,    setEditPkg]    = useState(null);
  const [form,       setForm]       = useState(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);

  // ─── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pkgRes, bkRes] = await Promise.all([
          getPackages({ limit: 100 }),
          getAllBookings(),
        ]);
        setPackages(pkgRes.data.packages);
        setBookings(bkRes.data.bookings);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ─── Package form ──────────────────────────────────────────────────────────
  const openNew  = () => { setForm(BLANK_FORM); setEditPkg(null); setShowForm(true); };
  const openEdit = (pkg) => {
    setForm({
      ...pkg,
      highlights:  (pkg.highlights  || []).join('\n'),
      included:    (pkg.included    || []).join('\n'),
      notIncluded: (pkg.notIncluded || []).join('\n'),
    });
    setEditPkg(pkg._id);
    setShowForm(true);
  };

  const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price:        Number(form.price),
        maxGroupSize: Number(form.maxGroupSize),
        highlights:   form.highlights.split('\n').filter(Boolean),
        included:     form.included.split('\n').filter(Boolean),
        notIncluded:  form.notIncluded.split('\n').filter(Boolean),
      };

      if (editPkg) {
        const { data } = await updatePackage(editPkg, payload);
        setPackages(prev => prev.map(p => p._id === editPkg ? data : p));
        toast.success('Package updated!');
      } else {
        const { data } = await createPackage(payload);
        setPackages(prev => [data, ...prev]);
        toast.success('Package created!');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this package? This cannot be undone.')) return;
    try {
      await deletePackage(id);
      setPackages(prev => prev.filter(p => p._id !== id));
      toast.success('Package removed');
    } catch {
      toast.error('Failed to remove package');
    }
  };

  // ─── Booking status update ─────────────────────────────────────────────────
  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking marked as ${status}`);
    } catch {
      toast.error('Failed to update booking');
    }
  };

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    packages:  packages.length,
    bookings:  bookings.length,
    revenue:   bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0),
    pending:   bookings.filter(b => b.status === 'pending').length,
  };

  return (
    <div style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', background: 'var(--sand)' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--mid-gray)' }}>Manage packages, bookings, and site content</p>
          </div>
          {activeTab === 'packages' && (
            <button onClick={openNew} className="btn btn-primary">+ Add Package</button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 36 }}>
          {[
            { icon: '📦', label: 'Total Packages', value: stats.packages },
            { icon: '📋', label: 'Total Bookings', value: stats.bookings },
            { icon: '⏳', label: 'Pending',        value: stats.pending  },
            { icon: '💰', label: 'Total Revenue',  value: `$${stats.revenue.toLocaleString()}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-dark)' }}>{value}</p>
              <p style={{ color: 'var(--mid-gray)', fontSize: '.85rem' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--sand-dark)', marginBottom: 28 }}>
          {['packages', 'bookings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 24px', fontSize: '.95rem', fontWeight: 600, background: 'none',
              textTransform: 'capitalize', cursor: 'pointer',
              color: activeTab === tab ? 'var(--amber-dark)' : 'var(--mid-gray)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--amber)' : 'transparent'}`,
              marginBottom: '-2px',
            }}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : activeTab === 'packages' ? (
          /* ─── PACKAGES TABLE ─────────────────────────────────────────────── */
          <div className="card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: 'var(--sand)', textAlign: 'left' }}>
                  {['Package', 'Location', 'Price', 'Duration', 'Category', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', fontSize: '.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--mid-gray)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, i) => (
                  <tr key={pkg._id} style={{ borderTop: '1px solid var(--sand-dark)', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={pkg.imageUrl} alt="" style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 'var(--r-sm)' }} />
                        <span style={{ fontWeight: 600, fontSize: '.9rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pkg.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '.875rem', color: 'var(--charcoal-mid)' }}>{pkg.location}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--amber-dark)' }}>${pkg.price.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '.875rem', color: 'var(--charcoal-mid)' }}>{pkg.duration}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-amber">{pkg.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(pkg)} style={{
                          padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: '.8rem',
                          fontWeight: 600, cursor: 'pointer', background: 'rgba(49,130,206,.1)',
                          color: 'var(--blue)', border: '1px solid rgba(49,130,206,.3)',
                        }}>Edit</button>
                        <button onClick={() => handleDelete(pkg._id)} style={{
                          padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: '.8rem',
                          fontWeight: 600, cursor: 'pointer', background: 'rgba(229,62,62,.1)',
                          color: 'var(--red)', border: '1px solid rgba(229,62,62,.3)',
                        }}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ─── BOOKINGS TABLE ─────────────────────────────────────────────── */
          <div className="card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr style={{ background: 'var(--sand)', textAlign: 'left' }}>
                  {['Customer', 'Package', 'Date', 'Travelers', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', fontSize: '.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--mid-gray)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(bk => {
                  const statusColor = { pending: 'badge-amber', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-blue' }[bk.status] || 'badge-gray';
                  return (
                    <tr key={bk._id} style={{ borderTop: '1px solid var(--sand-dark)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--sand)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <p style={{ fontWeight: 600, fontSize: '.875rem' }}>{bk.user?.name}</p>
                        <p style={{ fontSize: '.75rem', color: 'var(--mid-gray)' }}>{bk.user?.email}</p>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '.875rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bk.package?.title}</td>
                      <td style={{ padding: '14px 16px', fontSize: '.875rem', color: 'var(--charcoal-mid)' }}>
                        {new Date(bk.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>{bk.travelers}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--amber-dark)' }}>${bk.totalAmount.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${statusColor}`}>{bk.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          value={bk.status}
                          onChange={e => handleBookingStatus(bk._id, e.target.value)}
                          style={{
                            padding: '6px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--sand-dark)',
                            fontSize: '.8rem', cursor: 'pointer', background: 'var(--white)',
                          }}
                        >
                          {['pending','confirmed','completed','cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Package Form Modal ───────────────────────────────────────────── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
          backdropFilter: 'blur(4px)', zIndex: 9999,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '40px 16px', overflowY: 'auto',
        }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--r-lg)',
            padding: '36px', width: '100%', maxWidth: 680,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: '1.4rem' }}>{editPkg ? 'Edit Package' : 'Create New Package'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', fontSize: '1.4rem', color: 'var(--mid-gray)', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { name: 'title',     label: 'Title *',          type: 'text',   placeholder: 'Amazing Bali Getaway' },
                  { name: 'location',  label: 'Location *',       type: 'text',   placeholder: 'Bali, Indonesia' },
                  { name: 'country',   label: 'Country',          type: 'text',   placeholder: 'Indonesia' },
                  { name: 'price',     label: 'Price (USD) *',    type: 'number', placeholder: '1299' },
                  { name: 'duration',  label: 'Duration *',       type: 'text',   placeholder: '7 Days / 6 Nights' },
                  { name: 'maxGroupSize', label: 'Max Group Size', type: 'number', placeholder: '15' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name} className="form-group">
                    <label className="form-label">{label}</label>
                    <input type={type} name={name} value={form[name]} onChange={handleFormChange}
                      className="form-input" placeholder={placeholder} style={{ fontSize: '.875rem' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" value={form.category} onChange={handleFormChange} className="form-input" style={{ fontSize: '.875rem' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleFormChange} className="form-input" style={{ fontSize: '.875rem' }}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleFormChange}
                  className="form-input" placeholder="https://images.unsplash.com/..." style={{ fontSize: '.875rem' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handleFormChange}
                  className="form-input" rows={4} placeholder="Describe the travel package..." style={{ fontSize: '.875rem', resize: 'vertical' }} />
              </div>

              {[
                { name: 'highlights',  label: 'Highlights (one per line)' },
                { name: 'included',    label: 'What\'s Included (one per line)' },
                { name: 'notIncluded', label: 'Not Included (one per line)' },
              ].map(({ name, label }) => (
                <div key={name} className="form-group">
                  <label className="form-label">{label}</label>
                  <textarea name={name} value={form[name]} onChange={handleFormChange}
                    className="form-input" rows={3} placeholder={`Item 1\nItem 2\nItem 3`} style={{ fontSize: '.875rem', resize: 'vertical' }} />
                </div>
              ))}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  {submitting ? 'Saving...' : (editPkg ? 'Update Package' : 'Create Package')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
