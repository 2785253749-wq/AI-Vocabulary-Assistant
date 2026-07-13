'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/axios';

interface WrongWordItem {
  id: number;
  word_id: number;
  wrong_count: number;
  created_time: string;
  word: {
    id: number;
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
  } | null;
}

type ReviewMode = 'normal' | 'hard' | 'all';

export default function WrongWordsPage() {
  const router = useRouter();
  const [items, setItems] = useState<WrongWordItem[]>([]);
  const [mode, setMode] = useState<ReviewMode>('normal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadWrongWords();
  }, []);

  const loadWrongWords = async () => {
    setLoading(true);
    setError('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/wrong/list');
      if (res.code === 0) {
        setItems(res.data.items || []);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wrongId: number) => {
    setDeleting(wrongId);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.delete(`/wrong/${wrongId}`);
      if (res.code === 0) {
        setItems((prev) => prev.filter((item) => item.id !== wrongId));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="page-container text-center py-20">
          <p className="text-gray-500">加载中...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Icon name="wrong" size={28} /> 错词本
        </h1>
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card text-center !p-4 bg-red-50">
            <p className="text-2xl font-bold text-red-700">{items.length}</p>
            <p className="text-xs text-red-600 mt-1">待复习</p>
          </div>
          <div className="card text-center !p-4 bg-yellow-50">
            <p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.wrong_count > 1).length}</p>
            <p className="text-xs text-yellow-600 mt-1">多次错误</p>
          </div>
        </div>

        {/* 复习模式选择 */}
        {items.length > 0 && (
          <div className="card mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">选择复习模式</p>
            <div className="flex gap-2">
              {([
                { key: 'normal' as ReviewMode, label: '普通复习', desc: '按优先级排序' },
                { key: 'hard' as ReviewMode, label: '困难优先', desc: '仅高优先级单词' },
                { key: 'all' as ReviewMode, label: '全部复习', desc: '所有错词' },
              ]).map(m => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex-1 rounded-lg border p-3 text-left transition-colors ${
                    mode === m.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`text-sm font-medium ${mode === m.key ? 'text-blue-700' : 'text-gray-700'}`}>{m.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Button icon="book" onClick={() => router.push(`/wrong/review?mode=${mode}`)}>开始复习</Button>
            </div>
          </div>
        )}
        {items.length === 0 && (
          <div className="card text-center !p-4 flex items-center justify-center mb-6">
            <Button icon="book" variant="secondary" disabled>暂无单词可复习</Button>
          </div>
        )}

        {error && (
          <div className="card mb-4 text-center text-red-500">
            <p>{error}</p>
            <button onClick={loadWrongWords} className="btn-primary mt-2">重试</button>
          </div>
        )}

        {items.length === 0 && !error ? (
          <div className="card text-center py-12">
            <Icon name="trophy" size={48} className="text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">错词本为空</p>
            <p className="text-gray-400 text-sm mt-1">继续加油！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="card flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-gray-800">
                      {item.word?.word || '(已删除)'}
                    </span>
                    {item.word?.phonetic && (
                      <span className="text-sm text-gray-400">{item.word.phonetic}</span>
                    )}
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                      错{ item.wrong_count }次
                    </span>
                  </div>
                  {item.word && (
                    <p className="text-gray-600 mt-1">{item.word.meaning}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4 shrink-0"
                >
                  {deleting === item.id ? '...' : '移除'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
