
import React from 'react';
import { Player } from '../types';

interface GameStatusProps {
  winner: Player | 'Draw' | null;
  currentPlayer: Player;
  isAiTurn: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, currentPlayer, isAiTurn }) => {
  let statusText: string;
  let textColor = 'text-gray-300';

  if (winner) {
    if (winner === 'Draw') {
      statusText = "It's a Draw!";
      textColor = 'text-yellow-400';
    } else {
      statusText = `${winner} Wins!`;
      textColor = winner === 'X' ? 'text-cyan-400' : 'text-rose-500';
    }
  } else if (isAiTurn) {
    statusText = 'AI is thinking...';
    textColor = 'text-purple-400 animate-pulse';
  } else {
    statusText = `Player ${currentPlayer}'s Turn`;
    textColor = currentPlayer === 'X' ? 'text-cyan-400' : 'text-rose-500';
  }

  return (
    <div className="h-12 flex items-center justify-center">
        <h2 className={`text-2xl font-bold font-game transition-all duration-300 ${textColor}`}>
            {statusText}
        </h2>
    </div>
  );
};

export default GameStatus;
