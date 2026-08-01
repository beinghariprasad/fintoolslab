interface ProgProseProps {
  eyebrow?: string;
  title: string; // may contain <em> markup (generator-authored, trusted)
  paragraphs: string[]; // may contain <strong>/<em> markup
}

export function ProgProse({ eyebrow, title, paragraphs }: ProgProseProps) {
  return (
    <section className="container" style={{ paddingBlock: 'clamp(24px, 3.5vw, 44px)' }}>
      <div style={{ maxWidth: '76ch' }}>
        <div className="bd-head" style={{ marginBottom: 14 }}>
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </div>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-2)', margin: '0 0 14px' }}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
    </section>
  );
}
