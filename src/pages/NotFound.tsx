import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | Fin Tools Lab</title></Helmet>
      <section style={{ paddingBlock: 'clamp(80px, 12vw, 200px)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(80px, 15vw, 160px)', lineHeight: 1, color: 'var(--ink-4)', marginBottom: 16 }}>404</div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: 12 }}>
            Page not <em style={{ color: 'var(--ft-accent)', fontStyle: 'italic' }}>found</em>.
          </h1>
          <p style={{ color: 'var(--ink-2)', fontSize: 17, maxWidth: '46ch', margin: '0 auto 32px' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">Go home</Link>
            <Link to="/calculators" className="btn btn-ghost">Browse calculators</Link>
          </div>
        </div>
      </section>
    </>
  );
}
