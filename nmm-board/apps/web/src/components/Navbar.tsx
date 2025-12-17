'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import authService from '@/lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setUsername(authService.getCurrentUsername());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:opacity-80 transition">
            Board App
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && username ? (
              <>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                  <FiUser />
                  <span className="font-medium">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition font-medium"
                >
                  <FiLogOut />
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
