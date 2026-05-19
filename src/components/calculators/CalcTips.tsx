interface Tip {
  title: string;
  text: string;
}

export function CalcTips({ items }: { items: Tip[] }) {
  return (
    <section className="container" style={{ paddingBlock: 'clamp(56px, 7vw, 96px)' }}>
      <div className="eyebrow" style={{ marginBottom: 14 }}>Practical tips</div>
      <h2
        style={{
          fontFamily: 'var(--ff-display)',
          fontWeight: 400,
          fontSize: 'clamp(28px, 3.4vw, 44px)',
          letterSpacing: '-0.015em',
          margin: '0 0 36px',
          maxWidth: '20ch',
          lineHeight: 1,
        }}
      >
        Six ways to <em style={{ color: 'var(--ft-accent)', fontStyle: 'italic' }}>actually use</em> these numbers.
      </h2>
      <div className="tips-grid">
        {items.map((tip, i) => (
          <div key={i} className="tip-card">
            <div className="tip-n">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
