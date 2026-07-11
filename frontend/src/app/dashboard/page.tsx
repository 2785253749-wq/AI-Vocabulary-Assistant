'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import apiClient from '@/lib/axios';
import { getUser } from '@/lib/auth';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface StatsData {
  total_words: number;
  known_words: number;
  forgot_words: number;
  today_count: number;
  study_days: number;
  week_data: { date: string; count: number; known: number; forgot: number }[];
}

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) setUsername(user.username);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/statistics');
      if (res.code === 0) setStats(res.data);
    } catch { /* ignore */ }
  };

  // 格式化图表日期标签
  const chartData = (stats?.week_data || []).map((d) => ({
    ...d,
    label: d.date.slice(5), // MM-DD
  }));

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
          <div className="card text-center bg-blue-50">
            <p className="text-3xl font-bold text-blue-700">{stats?.today_count ?? '--'}</p>
            <p className="text-sm text-blue-600 mt-1">今日学习</p>
          </div>
          <div className="card text-center bg-green-50">
            <p className="text-3xl font-bold text-green-700">{stats?.total_words ?? '--'}</p>
            <p className="text-sm text-green-600 mt-1">累计词汇</p>
          </div>
          <div className="card text-center bg-yellow-50">
            <p className="text-3xl font-bold text-yellow-700">{stats?.known_words ?? '--'}</p>
            <p className="text-sm text-yellow-600 mt-1">掌握数量</p>
          </div>
          <div className="card text-center bg-red-50">
            <p className="text-3xl font-bold text-red-700">{stats?.forgot_words ?? '--'}</p>
            <p className="text-sm text-red-600 mt-1">错词数量</p>
          </div>
        </div>

        {/* 7天学习趋势图 */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">📈 最近7天学习趋势</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="known" name="认识" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="forgot" name="忘记" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">暂无学习数据</p>
          )}
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/learn" className="card hover:shadow-md transition-shadow text-center">
            <p className="text-2xl mb-1">📚</p>
            <p className="font-medium text-gray-700">开始学习</p>
          </a>
          <a href="/wrong" className="card hover:shadow-md transition-shadow text-center">
            <p className="text-2xl mb-1">📕</p>
            <p className="font-medium text-gray-700">错词本 ({stats?.forgot_words ?? 0})</p>
          </a>
          <a href="/ai" className="card hover:shadow-md transition-shadow text-center">
            <p className="text-2xl mb-1">🤖</p>
            <p className="font-medium text-gray-700">AI助手</p>
          </a>
        </div>
      </main>
    </div>
  );
}
