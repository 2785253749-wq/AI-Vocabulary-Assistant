'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import FlashCard from '@/components/FlashCard';
import apiClient from '@/lib/axios';

interface WordItem {
  id: number; word: string; phonetic: string; meaning: string;
  example: string; difficulty: number; study_status: string | null;
}
type ReviewStatus = 'known' | 'fuzzy' | 'forgot';

export default function LearnPage() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState({ known: 0, fuzzy: 0, forgot: 0 });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ type: string; title: string; content: string } | null>(null);

  const fetchAI = async (type: 'example' | 'memory') => {
    if (submitting || currentIndex >= words.length) return;
    const w = words[currentIndex];
    setAiLoading(true); setAiResult(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post(`/ai/${type}`, { word: w.word, meaning: w.meaning });
      if (res.code === 0 && res.data) {
        const d = res.data;
        setAiResult(type === 'example'
          ? { type, title: `${w.word} 的例句`, content: `${d.sentence}\n\n${d.translation}` }
          : { type, title: `${w.word} 的记忆法`, content: `【词根分析】\n${d.root}\n\n【联想记忆】\n${d.memory}` });
      }
    } catch { setAiResult({ type, title: '出错了', content: 'AI请求失败，请检查API Key配置或稍后重试' }); }
    finally { setAiLoading(false); }
  };

  useEffect(() => { loadWords(); }, []);

  const loadWords = async () => {
    setLoading(true); setError(''); setFinished(false);
    setCurrentIndex(0); setCounts({ known: 0, fuzzy: 0, forgot: 0 });
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/words/today', { params: { count: 10 } });
      if (res.code === 0 && res.data.words?.length > 0) setWords(res.data.words);
      else setError('暂无单词数据');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { setError(err?.response?.data?.message || '加载单词失败'); }
    finally { setLoading(false); }
  };

  const submitReview = async (status: ReviewStatus) => {
    if (submitting || currentIndex >= words.length) return;
    const word = words[currentIndex]; setSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post('/study/record', { word_id: word.id, status });
      if (res.code === 0) { setCounts(p => ({ ...p, [status]: p[status] + 1 })); nextWord(); }
    } catch { nextWord(); } finally { setSubmitting(false); }
  };

  const nextWord = () => currentIndex + 1 >= words.length ? setFinished(true) : setCurrentIndex(i => i + 1);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loading fullScreen text="加载单词中..." /></div>;

  if (error) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <main className="page-container text-center py-20">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={loadWords}>重试</Button>
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
              <Button onClick={loadWords}>再学一组</Button>
              <a href="/dashboard"><Button variant="secondary">返回仪表盘</Button></a>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const currentWord = words[currentIndex], progress = (currentIndex / words.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2"><Icon name="book" size={28} />单词学习</h1>

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
        </div>

        <FlashCard key={currentWord.id} word={currentWord.word} phonetic={currentWord.phonetic} meaning={currentWord.meaning} example={currentWord.example} />

        <div className="flex justify-center gap-4 mt-6">
          <Button variant="danger" size="lg" onClick={() => submitReview('forgot')} disabled={submitting} icon="error">忘记</Button>
          <Button variant="secondary" size="lg" onClick={() => submitReview('fuzzy')} disabled={submitting} icon="warning">模糊</Button>
          <Button variant="success" size="lg" onClick={() => submitReview('known')} disabled={submitting} icon="success">认识</Button>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button onClick={() => fetchAI('example')} disabled={aiLoading}
            className="text-sm text-blue-600 hover:text-blue-700 border border-blue-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1">
            <Icon name="robot" size={16} /> {aiLoading ? '生成中...' : 'AI例句'}
          </button>
          <button onClick={() => fetchAI('memory')} disabled={aiLoading}
            className="text-sm text-purple-600 hover:text-purple-700 border border-purple-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1">
            <Icon name="brain" size={16} /> {aiLoading ? '生成中...' : 'AI记忆法'}
          </button>
        </div>

        <Modal open={!!aiResult} onClose={() => setAiResult(null)} title={aiResult?.title}>
          <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{aiResult?.content}</p>
        </Modal>
      </main>
    </div>
  );
}
