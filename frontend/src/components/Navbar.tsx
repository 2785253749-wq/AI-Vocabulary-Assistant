'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, isAuthenticated } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [pathname]); // 路由变化时重新检查

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: '📊 仪表盘' },
    { href: '/learn', label: '📚 学习' },
    { href: '/wrong', label: '📕 错词本' },
    { href: '/ai', label: '🤖 AI助手' },
    { href: '/profile', label: '👤 个人' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          📚 AI单词助手
        </Link>

        <div className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {loggedIn && (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-2"
              title="退出登录"
            >
              退出
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
