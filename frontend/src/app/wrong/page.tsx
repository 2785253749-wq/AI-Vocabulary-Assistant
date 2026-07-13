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

export default function WrongWordsPage() {
  const router = useRouter();
  const [items, setItems] = useState<WrongWordItem[]>([]);
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
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-500">共 {items.length} 个需要复习的单词</p>
          {items.length > 0 && (
            <Button icon="book" onClick={() => router.push('/wrong/review')}>开始复习</Button>
          )}
        </div>

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
