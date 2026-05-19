import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  q: string;
  a: string;
}

interface CalcFAQProps {
  items: FAQItem[];
  guideLink?: string;
}

export function CalcFAQ({ items, guideLink }: CalcFAQProps) {
  const [open, setOpen] = useState(0);
  return (
    <section className="container">
      <div className="faq-head">
        <div>
          <div className="eyebrow">Questions</div>
          <h2>Common <em>follow-ups</em>.</h2>
        </div>
        {guideLink && (
          <Link to={guideLink} className="btn btn-ghost btn-sm">
            Read full guide
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <div key={i} className="faq-item" data-open={open === i ? 'true' : undefined}>
            <button type="button" className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span>{item.q}</span>
              <span className="ic">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5 V 19 M 5 12 H 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
