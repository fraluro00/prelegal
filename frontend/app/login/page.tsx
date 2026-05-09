'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#032147' }}>
          Prelegal
        </h1>
        <p className="text-sm mb-6" style={{ color: '#888888' }}>
          Sign in to your account
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#209dd7' } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          <Link
            href="/"
            className="block w-full text-center py-2 px-4 text-sm font-semibold text-white rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#753991' }}
          >
            Sign In
          </Link>
        </div>

        <p className="mt-4 text-xs text-center" style={{ color: '#888888' }}>
          Don&apos;t have an account?{' '}
          <Link href="/" className="underline" style={{ color: '#209dd7' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
