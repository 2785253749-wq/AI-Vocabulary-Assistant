'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Card from '@/components/Card';
import apiClient from '@/lib/axios';

type TabType = 'example' | 'memory' | 'analyze';

export default function AIPage() {
  const [tab, setTab] = useState<TabType>('example');
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'example', label: '生成例句', icon: 'message' },
    { key: 'memory', label: '生成记忆法', icon: 'brain' },
    { key: 'analyze', label: '学习分析', icon: 'chart' },
  ];

  const handleSubmit = async () => {
    if (tab !== 'analyze' && !word.trim()) { setError('请输入单词'); return; }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      if (tab === 'example') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await apiClient.post('/ai/example', { word: word.trim(), meaning: meaning.trim() });
        if (res.code === 0) {
          setResult(`例句：\n${res.data.sentence}\n\n翻译：\n${res.data.translation}`);
        } else setError(res.message);
      } else if (tab === 'memory') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await apiClient.post('/ai/memory', { word: word.trim(), meaning: meaning.trim() });
        if (res.code === 0) {
          setResult(`词根分析：\n${res.data.root}\n\n联想记忆：\n${res.data.memory}`);
        } else setError(res.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await apiClient.post('/ai/analyze', {});
        if (res.code === 0) {
          setResult(`学习分析：\n${res.data.analysis}`);
        } else setError(res.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'AI请求失败，请检查API Key配置');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="page-container">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Icon name="robot" size={28} />
          AI助手
        </h1>
        <p className="text-gray-500 mb-8">DeepSeek AI 增强你的学习效果</p>

        <Card>
          <div className="flex gap-2 border-b border-gray-200 pb-4 mb-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setResult(null); setError(''); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  tab === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon name={t.icon} size={16} /> {t.label}
              </button>
            ))}
          </div>

          {tab !== 'analyze' && (
            <div className="flex gap-3 mb-4">
              <input type="text" className="input-field flex-1" placeholder="输入英语单词" value={word} onChange={(e) => setWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
              <input type="text" className="input-field w-32" placeholder="释义(可选)" value={meaning} onChange={(e) => setMeaning(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
              <Button onClick={handleSubmit} loading={loading}>生成</Button>
            </div>
          )}

          {tab === 'analyze' && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-3">基于你最近7天的学习记录，AI为你分析学习情况</p>
              <Button onClick={handleSubmit} loading={loading} icon="chart">开始分析</Button>
            </div>
          )}

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">{error}</div>}

          {result && <div className="p-4 bg-green-50 border border-green-200 rounded-lg"><p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{result}</p></div>}

          {!result && !error && !loading && (
            <div className="text-center py-8 text-gray-400">
              <Icon name={tab === 'example' ? 'message' : tab === 'memory' ? 'brain' : 'chart'} size={36} className="mx-auto mb-2" />
              <p>{tab === 'analyze' ? '点击按钮开始分析' : '输入单词并点击生成'}</p>
            </div>
          )}

          {loading && <Loading text="AI正在思考..." />}
        </Card>

        <p className="text-xs text-gray-400 text-center mt-4">由 DeepSeek API 驱动 | 结果由AI生成，仅供参考</p>
      </main>
    </div>
  );
}
