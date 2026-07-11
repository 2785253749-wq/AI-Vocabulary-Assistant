'use client';

import Navbar from '@/components/Navbar';
import { getUser } from '@/lib/auth';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = getUser();
    if (user) setUsername(user.username);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 学习仪表盘</h1>
        <p className="text-gray-500 mb-8">
          {username ? `👋 你好，${username}！` : '欢迎回来'}
        </p>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: '今日学习', value: '--', color: 'bg-blue-50 text-blue-700' },
            { label: '已掌握', value: '--', color: 'bg-green-50 text-green-700' },
            { label: '错词数量', value: '--', color: 'bg-red-50 text-red-700' },
            { label: '学习进度', value: '--', color: 'bg-purple-50 text-purple-700' },
          ].map((stat) => (
            <div key={stat.label} className={`card text-center ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 今日单词列表占位 */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">📝 今日推荐单词</h2>
          <p className="text-gray-400 text-center py-8">单词列表将在 Phase 3 实现</p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700 text-center">
            🚧 开发状态：仪表盘功能将在 Phase 3 实现。用户认证系统已就绪 ✅
          </p>
        </div>
      </main>
    </div>
  );
}
