'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getUser } from '@/lib/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 个人中心</h1>
        <p className="text-gray-500 mb-8">管理你的账户和错词本</p>

        {/* 用户信息 */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">个人信息</h2>
          {user ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">用户名</span>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">邮箱</span>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">加载中...</p>
          )}
        </div>

        {/* 错词本占位 */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">📕 错词本</h2>
          <p className="text-gray-400 text-center py-8">错词本将在 Phase 3 实现</p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700 text-center">
            🚧 开发状态：错词本功能将在 Phase 3 实现。用户系统已就绪 ✅
          </p>
        </div>
      </main>
    </div>
  );
}
