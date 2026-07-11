'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout, isAuthenticated } from '@/lib/auth';
import { useState, useEffect } from 'react';
import Icon from '@/components/Icon';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: '仪表盘', icon: 'chart' },
    { href: '/learn', label: '学习', icon: 'book' },
    { href: '/wrong', label: '错词本', icon: 'wrong' },
    { href: '/ai', label: 'AI助手', icon: 'robot' },
    { href: '/profile', label: '个人', icon: 'user' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Icon name="book" size={24} />
          AI单词助手
        </Link>

        <div className="flex items-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors flex items-center gap-1 ${
                pathname === link.href
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon name={link.icon} size={16} />
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
