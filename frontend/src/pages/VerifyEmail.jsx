import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    api.post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        toast.success('Email verified!');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && <><div className="spinner" /><p>Verifying your email...</p></>}
        {status === 'success' && <><CheckCircle size={48} color="#22c55e" /><h2>Email Verified!</h2><p>Redirecting to login...</p></>}
        {status === 'error' && <><XCircle size={48} color="#ef4444" /><h2>Invalid Token</h2><p>This link may have expired.</p></>}
      </div>
    </div>
  );
}
