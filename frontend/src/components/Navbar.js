'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center hover:text-blue-700 transition-colors">
            <span className="text-3xl mr-2">📚</span>
            Sessions
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'creator' ? (
                  <Link href="/creator-dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                    My Sessions
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                    My Bookings
                  </Link>
                )}
                <Link href="/profile" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                  Profile
                </Link>
              </>
            ) : null}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 px-3 py-2">
                  {user.first_name || user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-white text-gray-700 border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 text-gray-700 font-semibold hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}