'use client';

import { useState } from 'react';

interface FlashCardProps {
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
}

export default function FlashCard({ word, phonetic, meaning, example }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex justify-center">
      <div
        className="flashcard-container w-full max-w-lg h-72 cursor-pointer select-none"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`flashcard-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* 正面 — 单词 */}
          <div className="flashcard-front absolute inset-0 card flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-gray-800 mb-2">{word}</p>
            {phonetic && (
              <p className="text-lg text-gray-500 mb-4">{phonetic}</p>
            )}
            <p className="text-sm text-gray-400 mt-8">👆 点击卡片翻转</p>
          </div>

          {/* 背面 — 释义 */}
          <div className="flashcard-back absolute inset-0 card flex flex-col items-center justify-center p-8">
            <p className="text-2xl font-bold text-gray-800 mb-4">{meaning}</p>
            {example && (
              <div className="text-center border-t border-gray-200 pt-4 mt-2">
                <p className="text-gray-600 text-sm italic">&quot;{example}&quot;</p>
              </div>
            )}
            <p className="text-sm text-gray-400 mt-6">👆 点击翻转回去</p>
          </div>
        </div>
      </div>
    </div>
  );
}
