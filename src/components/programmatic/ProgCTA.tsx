import { Link } from 'react-router-dom';

interface ProgCTAProps {
  label: string;
  title: string;
  text: string;
  links: { label: string; href: string }[];
}

export function ProgCTA({ label, title, text, links }: ProgCTAProps) {
  return (
    <section className="container" style={{ paddingBlock: 'clamp(16px, 2.5vw, 32px)' }}>
      <div className="inline-calc">
        <div className="label">{label}</div>
        <h4>{title}</h4>
        <p>{text}</p>
        <div className="row">
          {links.map((l) => (
            <Link key={l.href} to={l.href} className="btn btn-accent btn-sm">
              {l.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
