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
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-xl font-bold">
              Sessions Marketplace
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-blue-200">
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'creator' ? (
                  <Link href="/creator-dashboard" className="text-white hover:text-blue-200">
                    Creator Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-white hover:text-blue-200">
                    My Dashboard
                  </Link>
                )}
                <Link href="/profile" className="text-white hover:text-blue-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}