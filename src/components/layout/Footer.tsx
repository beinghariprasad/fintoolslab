import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Mail, Github, Twitter } from 'lucide-react';

const calculatorLinks = [
  { name: 'Compound Interest', href: '/calculators/compound-interest' },
  { name: 'Mortgage Calculator', href: '/calculators/mortgage' },
  { name: 'Loan Calculator', href: '/calculators/loan' },
  { name: 'Investment Calculator', href: '/calculators/investment' },
  { name: 'Retirement Calculator', href: '/calculators/retirement' },
];

const toolLinks = [
  { name: 'Savings Calculator', href: '/calculators/savings' },
  { name: 'Rent vs Buy', href: '/calculators/rent-vs-buy' },
  { name: 'Blog', href: '/blog' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
  { name: 'Contact', href: '/contact' },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Calculator className="h-8 w-8 text-primary" />
                <TrendingUp className="h-4 w-4 text-financial-gold absolute -top-1 -right-1" />
              </div>
              <span className="font-playfair font-semibold text-xl bg-gradient-to-r from-primary to-financial-blue bg-clip-text text-transparent">
                Fin Tools Lab
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional financial calculators and investment tools to help you make informed financial decisions. Free, accurate, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/fintoolslab" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/fintoolslab" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:contact@fintoolslab.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Calculators</h3>
            <ul className="space-y-3">
              {calculatorLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-3">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2026 Fin Tools Lab. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for better financial decisions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};