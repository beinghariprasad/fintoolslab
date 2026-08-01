import { Link } from 'react-router-dom';

export interface ProgTableColumn {
  label: string;
  align?: 'r';
}

export interface ProgTableCell {
  text: string;
  href?: string;
  accent?: boolean;
  strong?: boolean;
}

export type ProgTableRow = (string | ProgTableCell)[];

interface ProgTableProps {
  eyebrow: string;
  title: string; // may contain <em> markup (generator-authored, trusted)
  columns: ProgTableColumn[];
  rows: ProgTableRow[];
  note?: string;
}

export function ProgTable({ eyebrow, title, columns, rows, note }: ProgTableProps) {
  return (
    <section className="container" style={{ paddingBlock: 'clamp(24px, 3.5vw, 44px)' }}>
      <div className="bd-head">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2 dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="bd-table">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} className={c.align === 'r' ? 'r' : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const c: ProgTableCell = typeof cell === 'string' ? { text: cell } : cell;
                  const classes = [
                    j === 0 ? 'row-y' : '',
                    columns[j]?.align === 'r' ? 'r' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  const style: React.CSSProperties = {};
                  if (c.accent) style.color = 'var(--ft-accent)';
                  if (c.strong) style.fontWeight = 600;
                  return (
                    <td key={j} className={classes || undefined} style={style}>
                      {c.href ? (
                        <Link
                          to={c.href}
                          style={{ color: 'var(--ink)', textDecorationColor: 'var(--ft-accent)', textUnderlineOffset: 3 }}
                        >
                          {c.text}
                        </Link>
                      ) : (
                        c.text
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 12, maxWidth: '80ch', lineHeight: 1.55 }}>
          {note}
        </p>
      )}
    </section>
  );
}
