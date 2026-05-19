import { Link } from 'react-router-dom';
import { CompoundCalculatorMini } from '@/components/calculators/CompoundCalculatorMini';

export function HeroNew() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="hero-eyebrow">
            <span className="tag">Free</span>
            <span>Seven precise calculators · live now</span>
          </div>
          <h1>
            Model your<br />
            financial <em>future</em>,<br />
            not just a number.
          </h1>
          <p className="lede">
            Fin Tools Lab gives you a workspace of precise financial calculators —
            so the picture you get is connected, current, and easy to keep honest.
          </p>
          <div className="hero-actions">
            <Link to="/calculators/compound-interest" className="btn btn-primary">
              Try the compound model
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/calculators" className="btn btn-ghost">
              Browse all tools
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="n">7</div>
              <div className="l">Calculators</div>
            </div>
            <div className="hero-stat">
              <div className="n">100%</div>
              <div className="l">Free to use</div>
            </div>
            <div className="hero-stat">
              <div className="n">0</div>
              <div className="l">Data collected</div>
            </div>
          </div>
        </div>

        <div>
          <CompoundCalculatorMini />
        </div>
      </div>
    </section>
  );
}
