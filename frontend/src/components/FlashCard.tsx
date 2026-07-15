'use client';

interface FlashCardProps {
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export default function FlashCard({ word, phonetic, meaning, example, flipped, onFlip }: FlashCardProps) {
  const controlled = flipped !== undefined;
  const isFlipped = controlled ? flipped : false;

  const handleClick = () => {
    if (onFlip) onFlip(!isFlipped);
  };

  return (
    <div className="flex justify-center">
      <div
        className={`flashcard-container w-full max-w-lg h-72 ${controlled ? 'cursor-default' : 'cursor-pointer select-none'}`}
        onClick={controlled ? undefined : handleClick}
      >
        <div className={`flashcard-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
          {/* 正面 — 单词 + 音标 */}
          <div className="flashcard-front absolute inset-0 card flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-gray-800 mb-3">{word}</p>
            {phonetic && <p className="text-lg text-gray-500">{phonetic}</p>}
          </div>

          {/* 背面 — 释义 + 例句 */}
          <div className="flashcard-back absolute inset-0 card flex flex-col items-center justify-center p-8">
            <p className="text-2xl font-bold text-gray-800 mb-2">{word}</p>
            <p className="text-gray-500 text-sm mb-4">{meaning}</p>
            {example && (
              <div className="text-center border-t border-gray-200 pt-4 mt-2 w-full">
                <p className="text-gray-600 text-sm italic">&ldquo;{example}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
