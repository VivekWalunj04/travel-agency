import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { getPackages } from '../utils/api';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'Cultural', 'Wildlife', 'Adventure', 'Cruise', 'City'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-rating',    label: 'Top Rated' },
];

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [total,     setTotal]     = useState(0);
  const [pages,     setPages]     = useState(1);

  // ─── Filter state (initialised from URL query params) ──────────────────────
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || '-createdAt');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page,     setPage]     = useState(Number(searchParams.get('page')) || 1);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 9 };
      if (search)             params.search   = search;
      if (category !== 'All') params.category = category;
      if (minPrice)           params.minPrice = minPrice;
      if (maxPrice)           params.maxPrice = maxPrice;

      const { data } = await getPackages(params);
      setPackages(data.packages);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  // Sync URL with filters
  useEffect(() => {
    const p = {};
    if (search)             p.search   = search;
    if (category !== 'All') p.category = category;
    if (sort !== '-createdAt') p.sort   = sort;
    if (minPrice)           p.minPrice = minPrice;
    if (maxPrice)           p.maxPrice = maxPrice;
    if (page > 1)           p.page     = page;
    setSearchParams(p);
  }, [search, category, sort, minPrice, maxPrice, page, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setSort('-createdAt');
    setMinPrice(''); setMaxPrice(''); setPage(1);
  };

  const hasFilters = search || category !== 'All' || minPrice || maxPrice;

  return (
    <>
      {/* Page Header */}
      <div className="page-header" style={{ paddingTop: 'calc(var(--nav-h) + 40px)' }}>
        <div className="container">
          <h1>Explore Our Packages</h1>
          <p>Discover {total} extraordinary travel experiences worldwide</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start' }}>

            {/* ─── Sidebar Filters ─────────────────────────────────────────── */}
            <aside style={{
              background: 'var(--white)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--sand-dark)', padding: '28px',
              position: 'sticky', top: 'calc(var(--nav-h) + 20px)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.05rem' }}>Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} style={{
                    fontSize: '.78rem', color: 'var(--amber)', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}>Clear all</button>
                )}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginBottom: 8 }}>Search</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Destination, trip name..."
                    className="form-input"
                    style={{ flex: 1, fontSize: '.85rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>🔍</button>
                </div>
              </form>

              {/* Category */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Category</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setPage(1); }}
                      style={{
                        textAlign: 'left', padding: '8px 12px', borderRadius: 'var(--r-sm)',
                        fontSize: '.875rem', cursor: 'pointer', transition: 'all .15s',
                        background: category === cat ? 'rgba(212,134,10,.1)' : 'transparent',
                        color: category === cat ? 'var(--amber-dark)' : 'var(--charcoal-mid)',
                        fontWeight: category === cat ? 600 : 400,
                        border: category === cat ? '1px solid rgba(212,134,10,.3)' : '1px solid transparent',
                      }}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Price Range (USD)</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="form-input"
                    style={{ flex: 1, fontSize: '.85rem' }}
                    min="0"
                  />
                  <span style={{ color: 'var(--mid-gray)' }}>–</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="form-input"
                    style={{ flex: 1, fontSize: '.85rem' }}
                    min="0"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="form-label" style={{ marginBottom: 8 }}>Sort By</label>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="form-input"
                  style={{ fontSize: '.875rem' }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </aside>

            {/* ─── Packages Grid ───────────────────────────────────────────── */}
            <div>
              {/* Results count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <p style={{ color: 'var(--mid-gray)', fontSize: '.9rem' }}>
                  {loading ? 'Loading...' : `${total} package${total !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : packages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mid-gray)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</p>
                  <h3 style={{ marginBottom: 8, color: 'var(--charcoal)' }}>No packages found</h3>
                  <p style={{ marginBottom: 24 }}>Try adjusting your filters or search term</p>
                  <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 24,
                }}>
                  {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-ghost"
                    style={{ padding: '9px 18px', fontSize: '.875rem', opacity: page === 1 ? .4 : 1 }}
                  >← Prev</button>

                  {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        style={{
                          width: 40, height: 40, borderRadius: 'var(--r-sm)',
                          background: page === pageNum ? 'var(--amber)' : 'transparent',
                          color: page === pageNum ? 'var(--white)' : 'var(--charcoal)',
                          fontWeight: 600, fontSize: '.9rem', cursor: 'pointer',
                          border: page === pageNum ? 'none' : '1px solid var(--sand-dark)',
                        }}
                      >{pageNum}</button>
                    );
                  })}

                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="btn btn-ghost"
                    style={{ padding: '9px 18px', fontSize: '.875rem', opacity: page === pages ? .4 : 1 }}
                  >Next →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive sidebar collapse */}
      <style>{`
        @media (max-width: 900px) {
          .container > div { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
        }
      `}</style>
    </>
  );
};

export default PackagesPage;
