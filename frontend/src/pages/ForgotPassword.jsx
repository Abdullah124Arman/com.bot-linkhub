import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Zap, Info, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetToken(res.data.reset_token || '');
      setSent(true);
      toast.success('Reset token generated!');
    } catch (err) {
      toast.error('Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo"><Zap size={28} /><span>LinkHub</span></div>
        <h2>Reset Password</h2>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', color:'#22c55e', marginBottom:'1rem' }}>
              <Mail size={18} />
              <p style={{ margin: 0 }}>Reset link sent!</p>
            </div>

            {/* Production note */}
            <div style={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', padding:'0.85rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                <Info size={15} style={{ color:'#6366f1', flexShrink:0, marginTop:'2px' }} />
                <p style={{ fontSize:'0.82rem', color:'#94a3b8', margin:0, lineHeight:'1.5' }}>
                  <strong style={{ color:'#f1f5f9' }}>Production note:</strong> In a live deployment, this reset link would be automatically sent to <strong style={{ color:'#6366f1' }}>{email}</strong> via an email service (e.g. SendGrid / Resend). The token is shown here for demo purposes only.
                </p>
              </div>
            </div>

            {resetToken && (
              <>
                <p style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:'0.4rem' }}>Demo reset token:</p>
                <code style={{ wordBreak:'break-all', fontSize:'0.75rem', color:'#94a3b8', display:'block', background:'#0f172a', padding:'0.6rem', borderRadius:'6px', marginBottom:'1.25rem' }}>{resetToken}</code>
                <Link to={`/reset-password?token=${resetToken}`} className="btn btn-primary btn-full">
                  Continue to Reset Password →
                </Link>
              </>
            )}
          </div>
        )}
        <p className="auth-footer"><Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
}
