interface FormulaLegend {
  symbol: string;
  label: string;
  desc: string;
}

interface CalcExplainerProps {
  title: React.ReactNode;
  paragraphs: string[];
  formulaLabel: string;
  formulaDisplay: React.ReactNode;
  legend: FormulaLegend[];
}

export function CalcExplainer({ title, paragraphs, formulaLabel, formulaDisplay, legend }: CalcExplainerProps) {
  return (
    <section className="explainer">
      <div className="container explainer-grid">
        <div>
          <div className="eyebrow">The math</div>
          <h2>{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="formula">
          <div className="eyebrow" style={{ color: 'var(--ft-accent)', marginBottom: 16 }}>
            {formulaLabel}
          </div>
          <div className="eq">{formulaDisplay}</div>
          <dl className="legend">
            {legend.map((l, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <dt>{l.symbol}</dt>
                <dd><b>{l.label}</b> — {l.desc}</dd>
              </span>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
