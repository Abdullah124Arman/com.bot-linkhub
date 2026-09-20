import { Link } from 'react-router-dom';
import { Zap, BarChart2, Link2, User, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand"><Zap size={22} /><span>LinkHub</span></div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">Bitly + Linktree in one platform</div>
        <h1>Shorten. Track. <span className="gradient-text">Impress.</span></h1>
        <p>Create branded short links, track every click with analytics, and build a stunning Link-in-Bio page — all in one place.</p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">Start for Free</Link>
          <Link to="/login" className="btn btn-ghost btn-lg">Login</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <Link2 size={32} className="feature-icon" />
          <h3>Smart Short Links</h3>
          <p>Auto-generate 6-char codes or use custom vanity slugs. Collision-free, always fast.</p>
        </div>
        <div className="feature-card">
          <BarChart2 size={32} className="feature-icon" />
          <h3>Click Analytics</h3>
          <p>Track device types, referrers, and clicks over time on an interactive dashboard.</p>
        </div>
        <div className="feature-card">
          <User size={32} className="feature-icon" />
          <h3>Bio-Link Hub</h3>
          <p>Build a beautiful Link-in-Bio page with themes and an AI-powered bio generator.</p>
        </div>
        <div className="feature-card">
          <Shield size={32} className="feature-icon" />
          <h3>Secure by Default</h3>
          <p>Dual-token JWT auth, httpOnly cookies, and rate limiting on every endpoint.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Built by <strong>Abdullah Arman</strong> &mdash; com.bot Technical Assessment</p>
      </footer>
    </div>
  );
}
