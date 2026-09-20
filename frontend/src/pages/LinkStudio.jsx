import { useEffect, useState, useRef } from 'react';
import { Plus, Copy, Trash2, QrCode, ExternalLink, Search, Link2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { QRCodeSVG } from 'qrcode.react';

function CreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ original_url: '', title: '', custom_slug: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { original_url: form.original_url, title: form.title || undefined, custom_slug: form.custom_slug || undefined };
      await api.post('/api/links', payload);
      toast.success('Link created!');
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Create Short Link</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Destination URL *</label>
            <input type="url" placeholder="https://example.com/long-url" value={form.original_url}
              onChange={e => setForm({...form, original_url: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Title (optional)</label>
            <input type="text" placeholder="My awesome link" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Custom Slug (optional)</label>
            <div className="input-prefix">
              <span>/r/</span>
              <input type="text" placeholder="my-link" value={form.custom_slug}
                onChange={e => setForm({...form, custom_slug: e.target.value})} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QRModal({ link, baseUrl, onClose }) {
  const shortUrl = `${baseUrl}/r/${link.short_code}`;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ textAlign: 'center', maxWidth: '320px' }} onClick={e => e.stopPropagation()}>
        <h3>QR Code</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>{shortUrl}</p>
        <div style={{ display: 'inline-block', background: 'white', padding: '16px', borderRadius: '12px' }}>
          <QRCodeSVG value={shortUrl} size={200} />
        </div>
        <br /><br />
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function LinkStudio() {
  const [links, setLinks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [qrLink, setQrLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL;
  const debounceRef = useRef();

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/links?page=${page}&per_page=10${search ? `&search=${search}` : ''}`);
      setLinks(res.data.links);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLinks(); }, [page]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchLinks();
    }, 400);
  };

  const copyLink = (code) => {
    navigator.clipboard.writeText(`${baseUrl}/r/${code}`);
    toast.success('Copied to clipboard!');
  };

  const deleteLink = async (id) => {
    if (!confirm('Delete this link?')) return;
    await api.delete(`/api/links/${id}`);
    toast.success('Link deleted');
    fetchLinks();
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <>
      <Navbar />
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={fetchLinks} />}
      {qrLink && <QRModal link={qrLink} baseUrl={baseUrl} onClose={() => setQrLink(null)} />}
      <main className="page">
        <div className="page-header">
          <div>
            <h1>Link Studio</h1>
            <p>{total} total links</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} /> New Link
          </button>
        </div>

        <div className="search-bar">
          <Search size={16} />
          <input placeholder="Search links..." value={search} onChange={e => handleSearch(e.target.value)} />
        </div>

        <div className="table-card">
          {loading ? (
            <div className="table-loading"><div className="skeleton" style={{height:48}} /><div className="skeleton" style={{height:48}} /><div className="skeleton" style={{height:48}} /></div>
          ) : links.length === 0 ? (
            <div className="empty-state">
              <Link2 size={40} />
              <p>No links yet. Create your first one!</p>
            </div>
          ) : (
            <table className="links-table">
              <thead><tr><th>Short Link</th><th>Destination</th><th>Clicks</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {links.map(link => (
                  <tr key={link.id}>
                    <td>
                      <div className="short-code">
                        <code>/r/{link.short_code}</code>
                        {link.is_vanity && <span className="badge">Custom</span>}
                      </div>
                    </td>
                    <td><span className="url-cell" title={link.original_url}>{link.original_url.slice(0,50)}{link.original_url.length > 50 ? '...' : ''}</span></td>
                    <td><span className="click-count">{link.total_clicks}</span></td>
                    <td>{new Date(link.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" title="Copy" onClick={() => copyLink(link.short_code)}><Copy size={16} /></button>
                        <a className="btn-icon" href={`${baseUrl}/r/${link.short_code}`} target="_blank" rel="noreferrer" title="Open"><ExternalLink size={16} /></a>
                        <button className="btn-icon" title="QR Code" onClick={() => setQrLink(link)}><QrCode size={16} /></button>
                        <button className="btn-icon danger" title="Delete" onClick={() => deleteLink(link.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </main>
    </>
  );
}
