
export type Player = 'X' | 'O';
export type SquareValue = Player | null;

export enum GameMode {
  PVP = 'PvP',
  PVE = 'PvE',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}
