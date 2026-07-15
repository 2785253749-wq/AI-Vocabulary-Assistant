'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import { SkeletonStats, SkeletonCard } from '@/components/Skeleton';
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

  const chartData = (stats?.week_data || []).map((d) => ({
    ...d,
    label: d.date.slice(5),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Icon name="chart" size={28} />
          学习仪表盘
        </h1>
        <p className="text-gray-500 mb-8">
          {username ? `你好，${username}！` : '欢迎回来'}
        </p>

        {!stats ? (
          <SkeletonStats count={4} />
        ) : (
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
        )}

        {stats ? (
        <>
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="chart" size={20} />
            最近7天学习趋势
          </h2>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <a href="/learn" className="card hover:shadow-md transition-shadow text-center flex flex-col items-center gap-1">
            <Icon name="book" size={28} className="text-blue-600" />
            <span className="font-medium text-gray-700">开始学习</span>
          </a>
          <a href="/wrong" className="card hover:shadow-md transition-shadow text-center flex flex-col items-center gap-1">
            <Icon name="wrong" size={28} className="text-red-500" />
            <span className="font-medium text-gray-700">错词本 ({stats?.forgot_words ?? 0})</span>
          </a>
          <a href="/ai" className="card hover:shadow-md transition-shadow text-center flex flex-col items-center gap-1">
            <Icon name="robot" size={28} className="text-purple-600" />
            <span className="font-medium text-gray-700">AI助手</span>
          </a>
        </div>
        </>
        ) : (
          <SkeletonCard className="mb-6" />
        )}
      </main>
    </div>
  );
}
