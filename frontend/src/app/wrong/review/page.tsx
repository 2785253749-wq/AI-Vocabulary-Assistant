'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  priority_score: number;
  priority_level: 'high' | 'medium' | 'low';
}
type Status = 'known' | 'fuzzy' | 'forgot';

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'normal';
  const [words, setWords] = useState<ReviewWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [counts, setCounts] = useState({ known: 0, fuzzy: 0, forgot: 0 });
  const [stats, setStats] = useState<{ total: number; finished: number; known: number; forgot: number; accuracy: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [revising, setRevising] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ summary: string; weakness: string; suggestion: string; next_plan: string } | null>(null);
  const [aiError, setAiError] = useState('');

  useEffect(() => { loadWords(); }, []);

  const loadWords = async () => {
    setLoading(true); setError(''); setFinished(false);
    setCurrentIndex(0); setCounts({ known: 0, fuzzy: 0, forgot: 0 });
    setShowAnswer(false); setSelectedStatus(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/wrong/review', { params: { mode } });
      if (res.code === 0 && res.data.words?.length > 0) {
        setWords(res.data.words);
      } else setError('错词本为空，没有需要复习的单词');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { setError(err?.response?.data?.message || '加载失败'); } finally { setLoading(false); }
  };

  const submitReview = async (status: Status) => {
    if (submitting || currentIndex >= words.length) return;
    setSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post('/wrong/review', { word_id: words[currentIndex].word_id, status });
      if (res.code === 0) {
        setCounts(p => ({ ...p, [status]: p[status] + 1 }));
        setSelectedStatus(status);
        setShowAnswer(true);
      }
    } catch { /* ignore */ } finally { setSubmitting(false); }
  };

  const reviseResult = async () => {
    if (revising || !selectedStatus || selectedStatus === 'forgot') return;
    setRevising(true);
    const w = words[currentIndex];
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.put('/study/revise-result', {
        word_id: w.word_id, old_status: selectedStatus, new_status: 'forgot',
      });
      if (res.code === 0) {
        setCounts(p => ({
          ...p,
          [selectedStatus]: p[selectedStatus] - 1,
          forgot: p.forgot + 1,
        }));
        setSelectedStatus('forgot');
      }
    } catch { /* ignore */ } finally { setRevising(false); }
  };

  const doNext = () => {
    setShowAnswer(false);
    setSelectedStatus(null);
    if (currentIndex + 1 >= words.length) { setFinished(true); fetchStats(); }
    else setCurrentIndex(i => i + 1);
  };

  const fetchStats = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.get('/wrong/review/statistics');
      if (res.code === 0) setStats(res.data);
    } catch { /* ignore */ }
  };

  const handleAIAnalysis = async () => {
    setAiLoading(true); setAiError(''); setAiResult(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await apiClient.post('/ai/review-analysis', {
        total: counts.known + counts.fuzzy + counts.forgot,
        known: counts.known, forgot: counts.forgot, fuzzy: counts.fuzzy,
      });
      if (res.code === 0) setAiResult(res.data);
      else setAiError(res.message || 'AI分析失败');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) { setAiError(err?.response?.data?.message || 'AI服务暂时不可用'); }
    finally { setAiLoading(false); }
  };

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
    const accuracy = stats?.accuracy ?? (total > 0 ? Math.round((counts.known / total) * 100) : 0);
    return (
      <div className="min-h-screen bg-gray-50"><Navbar />
        <main className="page-container">
          <Card className="max-w-lg mx-auto text-center py-8">
            <Icon name="trophy" size={48} className="text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">复习完成！</h2>
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 mb-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
                <p className="text-xs text-blue-500">正确率</p>
              </div>
            </div>
            <p className="text-gray-500 mb-6">本次复习 {total} 个单词</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4"><p className="text-2xl font-bold text-green-600">{counts.known}</p><p className="text-sm text-green-500">已掌握</p></div>
              <div className="bg-yellow-50 rounded-lg p-4"><p className="text-2xl font-bold text-yellow-600">{counts.fuzzy}</p><p className="text-sm text-yellow-500">仍模糊</p></div>
              <div className="bg-red-50 rounded-lg p-4"><p className="text-2xl font-bold text-red-600">{counts.forgot}</p><p className="text-sm text-red-500">又忘了</p></div>
            </div>
            <div className="flex gap-3 justify-center mb-6">
              <Button onClick={loadWords}>再复习一次</Button>
              <Button variant="secondary" onClick={() => router.push('/wrong')}>返回错词本</Button>
            </div>

            {/* AI分析区域 */}
            {!aiResult && !aiError && (
              <div className="border-t border-gray-200 pt-6">
                <Button onClick={handleAIAnalysis} loading={aiLoading} icon="robot" variant="primary">
                  AI分析本次复习
                </Button>
              </div>
            )}

            {aiError && (
              <div className="border-t border-gray-200 pt-4 mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-600">{aiError}</div>
            )}

            {aiResult && (
              <div className="border-t border-gray-200 pt-4 mt-4 text-left">
                <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Icon name="robot" size={16} /> AI分析结果
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="font-medium text-blue-700 text-xs mb-0.5">总结</p>
                    <p className="text-blue-800">{aiResult.summary}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="font-medium text-yellow-700 text-xs mb-0.5">薄弱点</p>
                    <p className="text-yellow-800">{aiResult.weakness}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="font-medium text-green-700 text-xs mb-0.5">建议</p>
                    <p className="text-green-800">{aiResult.suggestion}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="font-medium text-purple-700 text-xs mb-0.5">下一步</p>
                    <p className="text-purple-800">{aiResult.next_plan}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </main>
      </div>
    );
  }

  const cw = words[currentIndex];
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
  const levelLabels = { high: '重点', medium: '加强', low: '普通' };
  const levelColors = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-gray-100 text-gray-600' };

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
          <p className="text-xs text-gray-400 text-center mt-2">
            已错 {cw.wrong_count} 次
            <span className={`ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[cw.priority_level]}`}>
              <Icon name="chart" size={10} />{levelLabels[cw.priority_level]}
            </span>
            <span className="ml-1 text-gray-400">({cw.priority_score}分)</span>
          </p>
        </div>
        <FlashCard
          word={cw.word} phonetic={cw.phonetic} meaning={cw.meaning}
          example={cw.example} flipped={showAnswer}
        />
        <div className="flex flex-col items-center gap-3 mt-6">
          {!showAnswer ? (
            <div className="flex justify-center gap-4">
              <Button variant="danger" size="lg" onClick={() => submitReview('forgot')} disabled={submitting} icon="error">又忘了</Button>
              <Button variant="secondary" size="lg" onClick={() => submitReview('fuzzy')} disabled={submitting} icon="warning">模糊</Button>
              <Button variant="success" size="lg" onClick={() => submitReview('known')} disabled={submitting} icon="success">掌握了</Button>
            </div>
          ) : (
            <>
              <div className={`text-sm font-medium px-4 py-1 rounded-full ${
                selectedStatus === 'known'  ? 'bg-green-100 text-green-700' :
                selectedStatus === 'fuzzy'  ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedStatus === 'known' && '✅ 你的选择：掌握'}
                {selectedStatus === 'fuzzy' && '⚠ 你的选择：模糊'}
                {selectedStatus === 'forgot' && '❌ 你的选择：又忘了'}
              </div>
              <div className="flex justify-center gap-3">
                {selectedStatus !== 'forgot' && (
                  <Button variant="danger" size="sm" onClick={reviseResult} loading={revising} icon="error">
                    记错了
                  </Button>
                )}
                <Button variant="primary" size="lg" onClick={doNext} icon="arrow">继续学习</Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function WrongReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><Loading fullScreen text="加载中..." /></div>}>
      <ReviewContent />
    </Suspense>
  );
}
