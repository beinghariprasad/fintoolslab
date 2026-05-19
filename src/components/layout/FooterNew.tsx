import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function FooterNew() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-block">
            <Link to="/" className="brand">
              <span className="brand-mark">
                <BrandLogo />
              </span>
              Fin Tools Lab
            </Link>
            <p>
              A workspace of precise financial calculators. Built by an independent team of
              engineers and former planners. Free, no ads in the tools.
            </p>
          </div>
          <div>
            <h4>Calculators</h4>
            <ul>
              <li><Link to="/calculators/compound-interest">Compound interest</Link></li>
              <li><Link to="/calculators/mortgage">Mortgage</Link></li>
              <li><Link to="/calculators/retirement">Retirement</Link></li>
              <li><Link to="/calculators/loan">Loan</Link></li>
              <li><Link to="/calculators/investment">Investment</Link></li>
            </ul>
          </div>
          <div>
            <h4>More tools</h4>
            <ul>
              <li><Link to="/calculators/savings">Savings goal</Link></li>
              <li><Link to="/calculators/rent-vs-buy">Rent vs. buy</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li><Link to="/blog/compound-interest-guide">Compound interest guide</Link></li>
              <li><Link to="/blog">All articles</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy</Link></li>
              <li><Link to="/terms-of-service">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Fin Tools Lab. Calculators are educational and not financial advice.</span>
          <span style={{ display: 'inline-flex', gap: 16, alignItems: 'center' }}>
            <a href="https://twitter.com/fintoolslab" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://github.com/fintoolslab" target="_blank" rel="noopener noreferrer">GitHub</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
