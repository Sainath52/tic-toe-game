
import React from 'react';
import { SquareValue } from '../types';
import Square from './Square';

interface BoardProps {
  board: SquareValue[];
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
}

const Board: React.FC<BoardProps> = ({ board, onSquareClick, winningLine }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-3 bg-black/30 rounded-xl shadow-2xl">
      {board.map((value, index) => (
        <Square
          key={index}
          index={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinning={!!winningLine && winningLine.includes(index)}
        />
      ))}
    </div>
  );
};

export default Board;
