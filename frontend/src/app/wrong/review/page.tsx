'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import FlashCard from '@/components/FlashCard';
import apiClient from '@/lib/axios';

interface ReviewWord {
  wrong_id: number;
  word_id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  wrong_count: number;
}
type Status = 'known' | 'fuzzy' | 'forgot';

export default function WrongReviewPage() {
  const router = useRouter();
  const [words, setWords] = useState<ReviewWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState({ known: 0, fuzzy: 0, forgot: 0 });

  useEffect(() => { loadWords(); }, []);

  const loadWords = async () => {
    setLoading(true); setError('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/wrong/review');
      if (res.code === 0 && res.data.words?.length > 0) {
        setWords(res.data.words);
      } else setError('错词本为空，没有需要复习的单词');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { setError(err?.response?.data?.message || '加载失败'); }
    finally { setLoading(false); }
  };

  const submitReview = async (status: Status) => {
    if (submitting || currentIndex >= words.length) return;
    const w = words[currentIndex];
    setSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post('/wrong/review', { word_id: w.word_id, status });
      if (res.code === 0) { setCounts(p => ({ ...p, [status]: p[status] + 1 })); nextWord(); }
    } catch { nextWord(); }
    finally { setSubmitting(false); }
  };

  const nextWord = () => currentIndex + 1 >= words.length ? setFinished(true) : setCurrentIndex(i => i + 1);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loading fullScreen text="加载错词中..." /></div>;

  if (error) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <main className="page-container text-center py-20">
        <Icon name="trophy" size={48} className="text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-4">{error}</p>
        <Button onClick={() => router.push('/wrong')}>返回错词本</Button>
      </main>
    </div>
  );

  if (finished) {
    const total = counts.known + counts.fuzzy + counts.forgot;
    return (
      <div className="min-h-screen bg-gray-50"><Navbar />
        <main className="page-container">
          <Card className="max-w-lg mx-auto text-center py-8">
            <Icon name="trophy" size={48} className="text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">复习完成！</h2>
            <p className="text-gray-500 mb-6">本次复习 {total} 个单词</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{counts.known}</p>
                <p className="text-sm text-green-500">已掌握</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-yellow-600">{counts.fuzzy}</p>
                <p className="text-sm text-yellow-500">仍模糊</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-600">{counts.forgot}</p>
                <p className="text-sm text-red-500">又忘了</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={loadWords}>再复习一次</Button>
              <Button variant="secondary" onClick={() => router.push('/wrong')}>返回错词本</Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const currentWord = words[currentIndex];
  const progress = (currentIndex / words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2"><Icon name="wrong" size={28} />错词复习</h1>

        <div className="max-w-lg mx-auto mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>进度: {currentIndex + 1} / {words.length}</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1"><Icon name="success" size={14} className="text-green-500" />{counts.known}</span>
              <span className="flex items-center gap-1"><Icon name="warning" size={14} className="text-yellow-500" />{counts.fuzzy}</span>
              <span className="flex items-center gap-1"><Icon name="error" size={14} className="text-red-500" />{counts.forgot}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">已错 {currentWord.wrong_count} 次</p>
        </div>

        <FlashCard word={currentWord.word} phonetic={currentWord.phonetic} meaning={currentWord.meaning} example={currentWord.example} />

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="danger" size="lg" onClick={() => submitReview('forgot')} disabled={submitting} icon="error">又忘了</Button>
          <Button variant="secondary" size="lg" onClick={() => submitReview('fuzzy')} disabled={submitting} icon="warning">模糊</Button>
          <Button variant="success" size="lg" onClick={() => submitReview('known')} disabled={submitting} icon="success">掌握了</Button>
        </div>
      </main>
    </div>
  );
}
