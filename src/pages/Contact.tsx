import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

const contactMethods = [
  { title: 'Email', detail: 'contact@fintoolslab.com', icon: 'M' },
  { title: 'Response time', detail: 'Within 24 hours', icon: 'T' },
  { title: 'Based in', detail: 'San Francisco, CA', icon: 'L' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>Contact Us - Fin Tools Lab</title>
        <meta name="description" content="Get in touch with the Fin Tools Lab team. We'd love to hear your feedback, feature requests, or questions about our financial calculators." />
        <link rel="canonical" href="https://fintoolslab.com/contact" />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1>Let's <em>talk</em>.</h1>
          <p className="lede">Feature request, bug report, or just want to say hi? We read every message.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                {contactMethods.map(m => (
                  <div key={m.title} className="content-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', fontFamily: 'var(--ff-display)', fontSize: 18, color: 'var(--ink-2)', flexShrink: 0 }}>
                        {m.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 15 }}>{m.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{m.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ft-accent-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--ft-accent-ink)', fontSize: 24 }}>&#10003;</div>
                  <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: 28 }}>Message sent!</h3>
                  <p style={{ color: 'var(--ink-2)', marginTop: 8 }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <label className="ft-label">Name</label>
                      <input className="ft-input" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="ft-label">Email</label>
                      <input className="ft-input" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="ft-label">Subject</label>
                    <input className="ft-input" placeholder="What's this about?" required />
                  </div>
                  <div>
                    <label className="ft-label">Message</label>
                    <textarea className="ft-textarea" placeholder="Tell us more..." required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Send message
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
