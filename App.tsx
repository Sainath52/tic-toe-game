
import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameControls from './components/GameControls';
import Scoreboard from './components/Scoreboard';
import GameStatus from './components/GameStatus';
import { SquareValue, Player, GameMode, Difficulty } from './types';
import { WINNING_COMBINATIONS } from './constants';
import { getAiMove } from './services/geminiService';

const App: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PVE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [playerSymbol] = useState<Player>('X'); // Human is always X in PvE for simplicity
  const [isAiTurn, setIsAiTurn] = useState(false);

  const checkWinner = useCallback((currentBoard: SquareValue[]): { winner: Player | 'Draw' | null; line: number[] | null } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a] as Player, line: combination };
      }
    }
    if (currentBoard.every(square => square !== null)) {
      return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
  }, []);

  const resetGame = useCallback((newGame = false) => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsAiTurn(false);
    if (newGame) {
      setScores({ X: 0, O: 0 });
    }
  }, []);
  
  const handleGameModeChange = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame(true);
  }, [resetGame]);

  const handleDifficultyChange = useCallback((level: Difficulty) => {
    setDifficulty(level);
    resetGame(true);
  }, [resetGame]);
  
  useEffect(() => {
    const gameResult = checkWinner(board);
    if (gameResult.winner) {
      if (!winner) { // Prevent multiple score updates
        setWinner(gameResult.winner);
        setWinningLine(gameResult.line);
        if (gameResult.winner !== 'Draw') {
          setScores(prev => ({ ...prev, [gameResult.winner]: prev[gameResult.winner] + 1 }));
        }
      }
      return; // Stop if game has ended
    }

    const triggerAiMove = async () => {
      setIsAiTurn(true);
      try {
        const aiMove = await getAiMove(board, currentPlayer, difficulty);
        // Check if the game is still active and the move is valid before applying it
        if (board[aiMove] === null && !checkWinner(board).winner) {
          handleSquareClick(aiMove, true);
        }
      } catch (e) {
        console.error("AI failed to move", e);
      } finally {
        setIsAiTurn(false);
      }
    };

    if (gameMode === GameMode.PVE && currentPlayer !== playerSymbol && !isAiTurn && !winner) {
      triggerAiMove();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, currentPlayer, gameMode, playerSymbol, checkWinner, difficulty, winner]);
  
  const handleSquareClick = (index: number, isAI: boolean = false) => {
    if (winner || board[index] || (isAiTurn && !isAI)) {
      return;
    }
  
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
  
    const gameResult = checkWinner(newBoard);
    if (!gameResult.winner) {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 flex flex-col items-center justify-center p-4">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-game tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Gemini Tic-Tac-Toe
            </h1>
            <p className="text-gray-400 mt-2">Challenge the Ultimate AI!</p>
        </header>

        <main className="flex flex-col items-center gap-6 w-full">
            <Scoreboard scores={scores} />
            <GameStatus winner={winner} currentPlayer={currentPlayer} isAiTurn={isAiTurn} />
            <Board board={board} onSquareClick={handleSquareClick} winningLine={winningLine} />

            {winner && (
                <button
                    onClick={() => resetGame()}
                    className="mt-4 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg text-lg animate-pulse"
                >
                    Play Again
                </button>
            )}

            <div className="mt-8 w-full">
                <GameControls 
                    gameMode={gameMode} 
                    setGameMode={handleGameModeChange}
                    difficulty={difficulty}
                    setDifficulty={handleDifficultyChange}
                    resetGame={resetGame}
                />
            </div>
        </main>
    </div>
  );
};

export default App;
