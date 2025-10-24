
import React from 'react';
import { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
  index: number;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning, index }) => {
  const playerXColor = 'text-cyan-400';
  const playerOColor = 'text-rose-500';

  const baseStyle = `relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-6xl md:text-7xl font-game rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4`;
  
  const backgroundStyle = (index % 2 === 0) ? 'bg-gray-800' : 'bg-gray-700';

  const winningStyle = isWinning ? 'bg-green-500/30 scale-110 ring-4 ring-green-500' : 'hover:bg-gray-600';

  const textStyle = value === 'X' ? playerXColor : playerOColor;

  return (
    <button
      className={`${baseStyle} ${backgroundStyle} ${winningStyle}`}
      onClick={onClick}
      aria-label={`Square ${index + 1}`}
    >
      <span className={`transition-transform duration-300 ${value ? 'scale-100' : 'scale-0'} ${textStyle}`}>
        {value}
      </span>
    </button>
  );
};

export default Square;
