import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.data?.error || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] -mt-[92px] md:-mt-[108px] pt-[124px] md:pt-[150px] items-center justify-center bg-[#EEF5FC] px-4 pb-20">
      <div className="w-full max-w-md rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] p-8 sm:p-10 shadow-soft">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-[#5BBBF7] px-3 py-1 text-xs font-semibold text-[#0B1B2B]">
            Admin Portal
          </span>
          <h1 className="editorial-h3 mt-3">Jituri Furnitures Sign In</h1>
          <p className="mt-2 text-xs text-[#4A5D73]">
            Sign in to manage catalog albums, photo uploads, and showroom collections.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="user" className="block text-xs font-semibold text-[#0B1B2B]">
              Username
            </label>
            <input
              id="user"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] placeholder-[#4A5D73]/50 outline-none transition-colors focus:border-[#0B1B2B]"
              required
            />
          </div>

          <div>
            <label htmlFor="pass" className="block text-xs font-semibold text-[#0B1B2B]">
              Password
            </label>
            <input
              id="pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] placeholder-[#4A5D73]/50 outline-none transition-colors focus:border-[#0B1B2B]"
              required
            />
          </div>

          {error && (
            <div className="rounded-[2px] border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[2px] bg-[#0B1B2B] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in to Dashboard →'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#D3E2F0] pt-4 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-[#4A5D73] transition-colors hover:text-[#0B1B2B]"
          >
            ← Back to public homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
