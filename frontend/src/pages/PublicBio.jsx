import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Zap, Share2, Check, Eye } from 'lucide-react';
import { detectPlatform, getPlatformIcon } from '../utils/platformIcons';

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n;
}

export default function PublicBio() {
  const { username } = useParams();
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/bio/${username}`)
      .then(res => setBio(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error || !bio) return (
    <div className="loading-screen" style={{ flexDirection: 'column', gap: '1rem' }}>
      <h2>Profile not found</h2>
      <p style={{ color: '#94a3b8' }}>This profile may not exist or is not published yet.</p>
    </div>
  );

  return (
    <div className={`bio-preview theme-${bio.theme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', border: 'none', borderRadius: 0, position: 'static' }}>

      {/* Share Button — fixed top right */}
      <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
        <button onClick={handleShare} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '999px',
          color: '#fff', padding: '0.5rem 1rem', cursor: 'pointer',
          fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s',
        }}>
          {copied ? <Check size={15} /> : <Share2 size={15} />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bio-preview-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: '600px', margin: '0 auto', width: '100%', padding: '5rem 2rem 3rem' }}>

        {/* Avatar */}
        {bio.avatar_url ? (
          <img src={bio.avatar_url} alt="avatar" className="preview-avatar" style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem' }} />
        ) : (
          <div className="preview-avatar-placeholder" style={{ width: '120px', height: '120px', fontSize: '3rem', margin: '0 auto 1.5rem' }}>
            {(bio.display_name || bio.username)[0].toUpperCase()}
          </div>
        )}

        {/* Name */}
        <h1 className="preview-name" style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
          {bio.display_name || `@${bio.username}`}
        </h1>

        {/* View Counter */}
        {bio.view_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', opacity: 0.65, fontSize: '0.82rem', marginBottom: '1rem' }}>
            <Eye size={13} />
            <span>{formatCount(bio.view_count)} {bio.view_count === 1 ? 'view' : 'views'}</span>
          </div>
        )}

        {/* Bio Text */}
        {bio.bio && (
          <p className="preview-bio" style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: '440px' }}>
            {bio.bio}
          </p>
        )}

        {/* Social Links with Platform Icons */}
        <div className="preview-links" style={{ gap: '0.85rem', width: '100%', maxWidth: '400px' }}>
          {bio.social_links.map((sl, i) => {
            const platform = detectPlatform(sl.url);
            const icon = getPlatformIcon(platform);
            const isEmail = platform === 'email';

            return (
              <a key={i}
                href={sl.url}
                target={isEmail ? '_self' : '_blank'}
                rel="noreferrer"
                className="preview-link-btn"
                style={{ padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{icon}</span>
                <span>{sl.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '1.25rem', fontSize: '0.82rem', opacity: 0.6 }}>
        <a href="/" style={{ color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
          <Zap size={13} /> Powered by LinkHub
        </a>
      </div>
    </div>
  );
}
