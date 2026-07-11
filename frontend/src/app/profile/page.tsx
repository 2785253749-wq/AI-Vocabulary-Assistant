'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import apiClient from '@/lib/axios';
import { getUser } from '@/lib/auth';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  created_time: string;
}

interface StatsData {
  total_words: number;
  known_words: number;
  forgot_words: number;
  today_count: number;
  study_days: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u as UserInfo);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/statistics');
      if (res.code === 0) setStats(res.data);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Icon name="user" size={28} /> 个人中心
        </h1>
        <p className="text-gray-500 mb-8">查看你的学习情况</p>

        {/* 用户信息 */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">个人信息</h2>
          {user ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">用户名</span>
                <p className="font-medium text-lg">{user.username}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">邮箱</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">学习天数</span>
                <p className="font-medium text-lg text-blue-600">{stats?.study_days ?? '--'} 天</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">注册时间</span>
                <p className="font-medium text-sm">{user.created_time?.slice(0, 10) || '--'}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">加载中...</p>
          )}
        </div>

        {/* 学习统计 */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Icon name="chart" size={20} /> 学习统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{stats?.today_count ?? '--'}</p>
              <p className="text-xs text-blue-600 mt-1">今日学习</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-700">{stats?.total_words ?? '--'}</p>
              <p className="text-xs text-green-600 mt-1">累计词汇</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700">{stats?.known_words ?? '--'}</p>
              <p className="text-xs text-yellow-600 mt-1">已掌握</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{stats?.forgot_words ?? '--'}</p>
              <p className="text-xs text-red-600 mt-1">错词数</p>
            </div>
          </div>

          {/* 进度条 */}
          {stats && stats.total_words > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>掌握进度</span>
                <span>{Math.round((stats.known_words / Math.max(stats.total_words, 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.round((stats.known_words / Math.max(stats.total_words, 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 错词本快捷入口 */}
        <a
          href="/wrong"
          className="card flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <span className="font-medium text-gray-700 flex items-center gap-2"><Icon name="wrong" size={18} /> 错词本</span>
            <span className="text-sm text-gray-400 ml-2">
              {stats?.forgot_words ?? 0} 个待复习
            </span>
          </div>
          <span className="text-gray-400">→</span>
        </a>
      </main>
    </div>
  );
}
