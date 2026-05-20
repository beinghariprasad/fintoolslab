import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Hari Prasad',
    role: 'Founder & Lead Developer',
    bio: 'Financial technology enthusiast with over 8 years of experience in building user-friendly financial tools. Passionate about making complex financial concepts accessible to everyone.',
    expertise: ['React', 'TypeScript', 'Financial Modeling', 'UX Design']
  },
  {
    name: 'Sarah Chen',
    role: 'Financial Content Lead',
    bio: 'Writes and reviews the educational content behind every calculator. Focused on translating financial research into language real people understand.',
    expertise: ['Financial Writing', 'Content Strategy', 'Research', 'Fact-Checking']
  },
  {
    name: 'Michael Rodriguez',
    role: 'UX/UI Designer',
    bio: 'Design specialist focused on creating intuitive and accessible financial tools. Believes that great design can make complex financial decisions easier to understand.',
    expertise: ['User Experience', 'Interface Design', 'Accessibility', 'Visual Design']
  }
];

const values = [
  { title: 'Accuracy', description: 'Every calculation is thoroughly tested and verified to ensure precise results you can trust.' },
  { title: 'Simplicity', description: 'Complex financial concepts, distilled into tools anyone can use in under 30 seconds.' },
  { title: 'Privacy', description: 'All calculations happen in your browser. We collect only standard analytics data — never your financial inputs.' },
  { title: 'Free forever', description: 'Professional-grade tools that cost nothing. Supported by non-intrusive advertising.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Fin Tools Lab - Our Mission & Team</title>
        <meta name="description" content="Learn about Fin Tools Lab's mission to make financial planning accessible with free, professional-grade calculators and educational tools." />
        <link rel="canonical" href="https://fintoolslab.com/about" />
      </Helmet>

      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">About us</div>
          <h1>Making finance <em>obvious</em>.</h1>
          <p className="lede">We build the tools we wish existed when we started managing our own money — professional-grade, beautifully simple, and free forever.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            {values.map((v) => (
              <div key={v.title} className="content-card">
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--bg-elev)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 12 }}>The team</div>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: 40 }}>People behind the <em style={{ color: 'var(--ft-accent)', fontStyle: 'italic' }}>numbers</em>.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {teamMembers.map((m) => (
              <div key={m.name} className="content-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', marginBottom: 16, fontFamily: 'var(--ff-display)', fontSize: 22, color: 'var(--ink-2)' }}>
                  {m.name[0]}
                </div>
                <h3 style={{ marginBottom: 4 }}>{m.name}</h3>
                <div style={{ fontSize: 13, color: 'var(--ft-accent)', fontWeight: 500, marginBottom: 12 }}>{m.role}</div>
                <p>{m.bio}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {m.expertise.map(e => (
                    <span key={e} className="chip">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
          <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', marginBottom: 16 }}>Ready to <em style={{ color: 'var(--ft-accent)', fontStyle: 'italic' }}>start</em>?</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: 17, lineHeight: 1.55, marginBottom: 24 }}>Try any of our calculators — no sign-up, no paywall, no data collection.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/calculators" className="btn btn-primary">Browse calculators</Link>
            <Link to="/contact" className="btn btn-ghost">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
