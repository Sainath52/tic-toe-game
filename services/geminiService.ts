
import { GoogleGenAI, Type } from "@google/genai";
import { SquareValue, Player, Difficulty } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI functionality will be disabled.");
}

const getAiPrompt = (board: SquareValue[], aiPlayer: Player, difficulty: Difficulty): string => {
  const playerSymbol = aiPlayer === 'X' ? 'O' : 'X';
  const boardString = `[${board.map(s => s ? `"${s}"` : 'null').join(', ')}]`;

  const baseInstruction = `You are a Tic-Tac-Toe AI. The board is a 9-element array. Indices are 0-8, left-to-right, top-to-bottom. The current board is ${boardString}. Your symbol is "${aiPlayer}". The human player is "${playerSymbol}". It is your turn.`;

  let difficultyInstruction = '';
  switch (difficulty) {
    case Difficulty.EASY:
      difficultyInstruction = 'Your strategy is to pick any available empty square at random. Do not think strategically.';
      break;
    case Difficulty.MEDIUM:
      difficultyInstruction = 'Your strategy is: 1. If you can win in one move, take that move. 2. If the opponent can win on their next move, block them. 3. Otherwise, pick a random available square.';
      break;
    case Difficulty.HARD:
      difficultyInstruction = 'Your strategy is to play perfectly. Use the minimax algorithm principles to find the optimal move. Prioritize winning, then blocking your opponent from winning, and finally making a strategic move to secure a future win or a draw. You must not lose.';
      break;
  }

  return `${baseInstruction} ${difficultyInstruction} Determine your next move and respond with ONLY a JSON object with your move's index.`;
};

export const getAiMove = async (board: SquareValue[], aiPlayer: Player, difficulty: Difficulty): Promise<number> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = getAiPrompt(board, aiPlayer, difficulty);

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    move: {
                        type: Type.INTEGER,
                        description: "The index (0-8) of the AI's chosen square."
                    }
                },
                required: ['move']
            },
            temperature: 0.7, // Add some variability for lower difficulties
        }
    });
    
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);

    if (typeof result.move === 'number' && result.move >= 0 && result.move <= 8 && board[result.move] === null) {
      return result.move;
    } else {
      console.error("AI returned an invalid move:", result.move);
      // Fallback: choose the first available spot
      return board.findIndex(spot => spot === null) ?? 0;
    }
  } catch (error) {
    console.error("Error fetching AI move:", error);
    // Fallback in case of API error
    const availableMoves = board.map((val, idx) => val === null ? idx : -1).filter(idx => idx !== -1);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
};
