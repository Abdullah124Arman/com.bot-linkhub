import { useEffect, useState } from 'react';
import { Plus, Trash2, Sparkles, Eye, EyeOff, Globe } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { detectPlatform, getPlatformIcon } from '../utils/platformIcons';

const THEMES = [
  { id: 'minimal_light', label: 'Minimal Light' },
  { id: 'dark_slate', label: 'Dark Slate' },
  { id: 'gradient', label: 'Gradient' },
];

export default function BioBuilder() {
  const { user } = useAuth();
  const [bio, setBio] = useState({ display_name: '', bio: '', avatar_url: '', theme: 'minimal_light', social_links: [], is_published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    api.get('/api/bio/me').then(res => {
      const data = res.data;
      setBio({
        display_name: data.display_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        theme: data.theme || 'minimal_light',
        social_links: data.social_links || [],
        is_published: data.is_published || false,
      });
    }).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/api/bio/me', bio);
      toast.success('Bio saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const generateBio = async () => {
    if (!aiKeywords.trim()) { toast.error('Enter some keywords first'); return; }
    setGenerating(true);
    try {
      const res = await api.post('/api/ai/generate-bio', { keywords: aiKeywords, tone: aiTone });
      setBio(b => ({ ...b, bio: res.data.bio }));
      toast.success('AI bio generated!');
      setShowAiPanel(false);
    } catch {
      toast.error('AI generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const addSocialLink = () => {
    setBio(b => ({ ...b, social_links: [...b.social_links, { label: '', url: '', icon: 'link' }] }));
  };

  const updateSocialLink = (i, field, value) => {
    const updated = bio.social_links.map((sl, idx) => idx === i ? { ...sl, [field]: value } : sl);
    setBio(b => ({ ...b, social_links: updated }));
  };

  const removeSocialLink = (i) => {
    setBio(b => ({ ...b, social_links: b.social_links.filter((_, idx) => idx !== i) }));
  };

  if (loading) return <><Navbar /><div className="page-loading"><div className="spinner" /></div></>;

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="page-header">
          <div><h1>Bio Builder</h1><p>Customize your public profile page</p></div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {user && (
              <a href={`/bio/${user.username}`} target="_blank" rel="noreferrer"
                className="btn btn-ghost"><Globe size={16} /> View Public Page</a>
            )}
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="bio-builder-grid">
          {/* Editor */}
          <div className="editor-panel">
            <div className="panel-section">
              <h3>Profile Info</h3>
              <div className="form-group">
                <label>Display Name</label>
                <input value={bio.display_name} onChange={e => setBio(b => ({...b, display_name: e.target.value}))}
                  placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input value={bio.avatar_url} onChange={e => setBio(b => ({...b, avatar_url: e.target.value}))}
                  placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAiPanel(!showAiPanel)}>
                    <Sparkles size={14} /> AI Generate
                  </button>
                </div>
                {showAiPanel && (
                  <div className="ai-panel">
                    <input placeholder="Keywords: Python developer, AI, Parul University..."
                      value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} />
                    <select value={aiTone} onChange={e => setAiTone(e.target.value)}>
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="casual">Casual</option>
                    </select>
                    <button className="btn btn-primary btn-sm" onClick={generateBio} disabled={generating}>
                      {generating ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                )}
                <textarea rows={4} value={bio.bio} onChange={e => setBio(b => ({...b, bio: e.target.value}))}
                  placeholder="Tell the world about yourself..." />
              </div>
            </div>

            <div className="panel-section">
              <h3>Theme</h3>
              <div className="theme-selector">
                {THEMES.map(t => (
                  <button key={t.id} className={`theme-btn ${bio.theme === t.id ? 'active' : ''}`}
                    onClick={() => setBio(b => ({...b, theme: t.id}))}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className="panel-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Social Links</h3>
                <button className="btn btn-ghost btn-sm" onClick={addSocialLink}><Plus size={14} /> Add</button>
              </div>
              {bio.social_links.map((sl, i) => (
                <div key={i} className="social-link-row">
                  <input placeholder="Label (e.g. GitHub)" value={sl.label} onChange={e => updateSocialLink(i, 'label', e.target.value)} />
                  <input placeholder="https://..." value={sl.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} />
                  <button className="btn-icon danger" onClick={() => removeSocialLink(i)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            <div className="panel-section">
              <div className="toggle-row">
                <div>
                  <h3>Publish Page</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Make your bio page visible to everyone</p>
                </div>
                <button className={`toggle ${bio.is_published ? 'on' : ''}`}
                  onClick={() => setBio(b => ({...b, is_published: !b.is_published}))}>
                  {bio.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className={`bio-preview theme-${bio.theme}`}>
            <div className="preview-label">Live Preview</div>
            <div className="bio-preview-card">
              {bio.avatar_url ? (
                <img src={bio.avatar_url} alt="avatar" className="preview-avatar" />
              ) : (
                <div className="preview-avatar-placeholder">{(bio.display_name || 'U')[0].toUpperCase()}</div>
              )}
              <h2 className="preview-name">{bio.display_name || 'Your Name'}</h2>
              <p className="preview-bio">{bio.bio || 'Your bio will appear here...'}</p>
              <div className="preview-links">
                {bio.social_links.map((sl, i) => {
                  const platform = detectPlatform(sl.url);
                  const icon = getPlatformIcon(platform);
                  return (
                    <a key={i} href={sl.url || '#'} target="_blank" rel="noreferrer" className="preview-link-btn"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>{icon}</span>
                      <span>{sl.label || 'Link'}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
