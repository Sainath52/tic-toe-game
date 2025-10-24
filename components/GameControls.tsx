
import React from 'react';
import { GameMode, Difficulty } from '../types';

interface GameControlsProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (level: Difficulty) => void;
  resetGame: (newGame?: boolean) => void;
}

const buttonStyle = "px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
const activeButtonStyle = "bg-purple-600 text-white shadow-md";
const inactiveButtonStyle = "bg-gray-700 text-gray-300 hover:bg-gray-600";
const selectStyle = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5";

const GameControls: React.FC<GameControlsProps> = ({ gameMode, setGameMode, difficulty, setDifficulty, resetGame }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 p-4 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className='flex-1'>
          <label className="block mb-2 text-sm font-medium text-gray-400">Game Mode</label>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setGameMode(GameMode.PVP)}
              className={`w-1/2 ${buttonStyle} ${gameMode === GameMode.PVP ? activeButtonStyle : inactiveButtonStyle}`}
            >
              PvP
            </button>
            <button
              onClick={() => setGameMode(GameMode.PVE)}
              className={`w-1/2 ${buttonStyle} ${gameMode === GameMode.PVE ? activeButtonStyle : inactiveButtonStyle}`}
            >
              PvE (AI)
            </button>
          </div>
        </div>
        
        {gameMode === GameMode.PVE && (
          <div className="flex-1">
            <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-400">AI Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={selectStyle}
            >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
            </select>
          </div>
        )}
      </div>

      <button
        onClick={() => resetGame(true)}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg text-lg"
      >
        New Game
      </button>
    </div>
  );
};

export default GameControls;
