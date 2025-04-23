'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-8 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-gray-800">
        Easy Tree
      </Link>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Hello, {user.firstName} {user.lastName}</span>
          <Link href="/dashboard"  className="btn-primary py-1 px-3 text-sm">
            Dashboard
          </Link>
          <Link href="/tree"       className="btn-secondary py-1 px-3 text-sm">
            Family Tree
          </Link>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link href="/login"    className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
          <Link href="/register" className="btn-primary py-1 px-3 text-sm">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
