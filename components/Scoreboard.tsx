
import React from 'react';

interface ScoreboardProps {
  scores: { X: number; O: number };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  return (
    <div className="flex justify-center items-center gap-8 w-full max-w-sm mx-auto p-4 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
      <div className="text-center">
        <p className="text-cyan-400 font-game text-3xl">{scores.X}</p>
        <p className="text-gray-400 text-sm">Player X</p>
      </div>
      <div className="text-4xl text-gray-500 font-game">:</div>
      <div className="text-center">
        <p className="text-rose-500 font-game text-3xl">{scores.O}</p>
        <p className="text-gray-400 text-sm">Player O</p>
      </div>
    </div>
  );
};

export default Scoreboard;
