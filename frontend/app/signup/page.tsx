'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API_URL, setAuth } from '../lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Registration failed');
        return;
      }
      const data = await res.json();
      setAuth(data.token, data.email);
      router.push('/');
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: '#032147' }}
      >
        <h1 className="text-2xl font-bold text-white">Prelegal</h1>
        <div>
          <p className="text-white/70 text-xl font-light leading-relaxed mb-3">
            AI-powered legal documents,<br />drafted in minutes.
          </p>
          <p className="text-white/40 text-sm">
            From NDAs to data processing agreements — professional templates guided by AI.
          </p>
        </div>
        <p className="text-white/30 text-xs">&copy; 2025 Prelegal</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#032147' }}>Prelegal</h1>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#032147' }}>Create an account</h2>
          <p className="text-sm mb-8" style={{ color: '#888888' }}>Sign up to start drafting legal documents</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#209dd7' } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#209dd7' } as React.CSSProperties}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#209dd7' } as React.CSSProperties}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-sm font-semibold text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#753991' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center" style={{ color: '#888888' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium underline" style={{ color: '#209dd7' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
