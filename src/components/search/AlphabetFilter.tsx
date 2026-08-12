import React from 'react';

interface AlphabetFilterProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

const ALPHABET = [
  'All',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const AlphabetFilter: React.FC<AlphabetFilterProps> = ({
  selectedLetter,
  onSelectLetter
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#152232] border-y border-[#CCECEE] dark:border-[#243B53] py-2 px-2 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-bold text-[#095D7E] dark:text-slate-300 uppercase px-2 shrink-0 hidden sm:inline">
          Index:
        </span>
        {ALPHABET.map((letter) => {
          const isSelected = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => onSelectLetter(letter)}
              id={`alphabet-filter-${letter}`}
              className={`shrink-0 min-w-[34px] h-[34px] rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-[#E2FCD6] dark:text-slate-950 shadow-sm scale-105 ring-2 ring-[#14967F]/30 dark:ring-[#2DD4BF]/30'
                  : 'bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-slate-300 hover:bg-[#CCECEE] dark:hover:bg-[#243B53]'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};
