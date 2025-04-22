'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const { login }             = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <h2 className="section-title text-center">Sign in to your account</h2>

          {error && (
            <p className="text-red-600 text-center">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-text/70">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-text/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Sign In
          </button>

          <p className="text-center text-text/70">
            Don’t have an account?{' '}
            <Link href="/register">
              <a className="btn-secondary inline-block">Register</a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
