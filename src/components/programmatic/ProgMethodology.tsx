interface ProgMethodologyProps {
  items: string[];
}

export function ProgMethodology({ items }: ProgMethodologyProps) {
  return (
    <section className="container" style={{ paddingBlock: 'clamp(16px, 2.5vw, 32px)' }}>
      <div className="callout">
        <div className="callout-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v5M12 16v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="callout-body">
          <p>
            <strong>How these numbers are calculated.</strong>
          </p>
          {items.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
