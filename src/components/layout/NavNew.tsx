import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

const NAV_LINKS = [
  { label: 'Calculators', href: '/calculators' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export function NavNew() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <BrandLogo />
          </span>
          Fin Tools Lab
        </Link>

        <nav className="nav-links">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              style={location.pathname.startsWith(item.href) ? { color: 'var(--ink)' } : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <Link to="/calculators" className="btn btn-primary btn-sm">
            Open the toolkit
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6 L 18 18 M 18 6 L 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 7 H 20 M 4 12 H 20 M 4 17 H 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="nav-drawer" data-open={open}>
        {NAV_LINKS.map((item) => (
          <Link key={item.label} to={item.href} onClick={() => setOpen(false)}>
            {item.label}
            <span style={{ color: 'var(--ink-4)' }}>→</span>
          </Link>
        ))}
        <Link className="btn btn-primary" to="/calculators" onClick={() => setOpen(false)}>
          Open the toolkit
        </Link>
      </div>
    </header>
  );
}
