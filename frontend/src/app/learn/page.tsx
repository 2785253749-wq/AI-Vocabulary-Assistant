'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FlashCard from '@/components/FlashCard';
import apiClient from '@/lib/axios';

interface WordItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  difficulty: number;
  study_status: string | null;
}

type ReviewStatus = 'known' | 'fuzzy' | 'forgot';

export default function LearnPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 统计
  const [counts, setCounts] = useState({ known: 0, fuzzy: 0, forgot: 0 });

  // AI辅助
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ type: string; title: string; content: string } | null>(null);

  const fetchAI = async (type: 'example' | 'memory') => {
    if (submitting || currentIndex >= words.length) return;
    const w = words[currentIndex];
    setAiLoading(true);
    setAiResult(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post(`/ai/${type}`, { word: w.word, meaning: w.meaning });
      if (res.code === 0 && res.data) {
        const d = res.data;
        if (type === 'example') {
          setAiResult({ type, title: `📖 ${w.word} 的例句`, content: `${d.sentence}\n\n${d.translation}` });
        } else {
          setAiResult({ type, title: `🧠 ${w.word} 的记忆法`, content: `【词根分析】\n${d.root}\n\n【联想记忆】\n${d.memory}` });
        }
      }
    } catch {
      setAiResult({ type, title: '出错了', content: 'AI请求失败，请检查API Key配置或稍后重试' });
    } finally {
      setAiLoading(false);
    }
  };

  // 加载今日单词
  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    setError('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/words/today', { params: { count: 10 } });
      if (res.code === 0 && res.data.words?.length > 0) {
        setWords(res.data.words);
      } else {
        setError('暂无单词数据');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || '加载单词失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交学习结果
  const submitReview = async (status: ReviewStatus) => {
    if (submitting || currentIndex >= words.length) return;

    const word = words[currentIndex];
    setSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post('/study/record', {
        word_id: word.id,
        status,
      });
      if (res.code === 0) {
        setCounts((prev) => ({ ...prev, [status]: prev[status] + 1 }));
        nextWord();
      }
    } catch {
      // 即使API出错也继续下一词
      nextWord();
    } finally {
      setSubmitting(false);
    }
  };

  const nextWord = () => {
    if (currentIndex + 1 >= words.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="page-container flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">加载单词中...</p>
        </main>
      </div>
    );
  }

  // 错误
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="page-container text-center py-20">
          <p className="text-red-500 text-lg">{error}</p>
          <button onClick={loadWords} className="btn-primary mt-4">重试</button>
        </main>
      </div>
    );
  }

  // 学习完成
  if (finished) {
    const total = counts.known + counts.fuzzy + counts.forgot;
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="page-container">
          <div className="card max-w-lg mx-auto text-center py-8">
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">学习完成！</h2>
            <p className="text-gray-500 mb-6">本次学习 {total} 个单词</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{counts.known}</p>
                <p className="text-sm text-green-500">认识</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-yellow-600">{counts.fuzzy}</p>
                <p className="text-sm text-yellow-500">模糊</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600">{counts.forgot}</p>
                <p className="text-sm text-red-500">忘记</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={loadWords} className="btn-primary">
                再学一组
              </button>
              <a href="/dashboard" className="btn-secondary">
                返回仪表盘
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 学习模式
  const currentWord = words[currentIndex];
  const progress = ((currentIndex) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 单词学习</h1>

        {/* 进度条 */}
        <div className="max-w-lg mx-auto mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>进度: {currentIndex + 1} / {words.length}</span>
            <span>
              ✅{counts.known} 🤔{counts.fuzzy} ❌{counts.forgot}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 闪卡 — key保证切换单词时重置翻转状态 */}
        <FlashCard
          key={currentWord.id}
          word={currentWord.word}
          phonetic={currentWord.phonetic}
          meaning={currentWord.meaning}
          example={currentWord.example}
        />

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => submitReview('forgot')}
            disabled={submitting}
            className="btn-danger text-lg px-8 py-3"
          >
            😰 忘记
          </button>
          <button
            onClick={() => submitReview('fuzzy')}
            disabled={submitting}
            className="btn-secondary text-lg px-8 py-3"
          >
            🤔 模糊
          </button>
          <button
            onClick={() => submitReview('known')}
            disabled={submitting}
            className="btn-success text-lg px-8 py-3"
          >
            😊 认识
          </button>
        </div>

        {/* AI辅助按钮 */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => fetchAI('example')}
            disabled={aiLoading}
            className="text-sm text-blue-600 hover:text-blue-700 border border-blue-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {aiLoading ? '生成中...' : '🤖 AI例句'}
          </button>
          <button
            onClick={() => fetchAI('memory')}
            disabled={aiLoading}
            className="text-sm text-purple-600 hover:text-purple-700 border border-purple-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {aiLoading ? '生成中...' : '🧠 AI记忆法'}
          </button>
        </div>

        {/* AI结果弹窗 */}
        {aiResult && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setAiResult(null)}>
            <div className="card max-w-md w-full mx-4 max-h-80 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">{aiResult.title}</h3>
                <button onClick={() => setAiResult(null)} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
              </div>
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{aiResult.content}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
