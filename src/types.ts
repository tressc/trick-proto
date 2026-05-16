export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Value = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Card {
  suit: Suit;
  value: Value;
  id: string;
}

export interface Hand {
  player: Card[];
  opponent: Card[];
}

export interface TricksWon {
  player: Card[];
  opponent: Card[];
}

export interface SuitCount {
  hearts: number;
  diamonds: number;
  clubs: number;
  spades: number;
}

export interface PlayerStats {
  player: SuitCount;
  opponent: SuitCount;
}

export interface GameState {
  deck: Card[];
  hand: Hand;
  trump: Card | null;
  trickNumber: number;
  currentOpponentCard: Card | null;
  selectedCard: Card | null;
  tricksWon: TricksWon;
  gameOver: boolean;
  playerWins: number;
  opponentWins: number;
}
