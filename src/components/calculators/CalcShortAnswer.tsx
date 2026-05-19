import type { ReactNode } from 'react';

export function CalcShortAnswer({ children, heading }: { children: ReactNode; heading?: string }) {
  return (
    <section className="container" style={{ paddingTop: 12 }}>
      <div className="short-answer">
        <span className="short-answer-mark">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8 V 13 M 12 16 V 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        {heading && <h2 className="short-answer-heading">{heading}</h2>}
        <p>{children}</p>
      </div>
    </section>
  );
}
