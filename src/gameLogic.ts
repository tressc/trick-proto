import type { Card, Suit, Value, GameState, PlayerStats } from "./types";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const VALUES: Value[] = [1, 2, 3, 4, 5, 6, 7, 8];
const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const SUIT_COLORS: Record<Suit, string> = {
  hearts: "#e74c3c",
  diamonds: "#f39c12",
  clubs: "#27ae60",
  spades: "#3498db",
};

export { SUIT_SYMBOLS, SUIT_COLORS };

export function createDeck(): Card[] {
  const deck: Card[] = [];
  let idCounter = 0;

  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({
        suit,
        value,
        id: `${suit}-${value}-${idCounter++}`,
      });
    }
  }

  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function initializeGame(): GameState {
  let deck = createDeck();
  deck = shuffleDeck(deck);

  // Deal 8 cards to player
  const playerHand = deck.splice(0, 12);

  // Next card is trump
  const trump = deck.shift()!;

  return {
    deck,
    hand: {
      player: playerHand,
      opponent: [],
    },
    trump,
    trickNumber: 1,
    currentOpponentCard: null,
    selectedCard: null,
    tricksWon: {
      player: [],
      opponent: [],
    },
    gameOver: false,
    playerWins: 0,
    opponentWins: 0,
  };
}

export function drawOpponentCard(state: GameState): Card {
  if (state.deck.length === 0) {
    throw new Error("Deck is empty");
  }
  return state.deck.shift()!;
}

export function isValidPlay(
  selectedCard: Card,
  opponentCard: Card,
  playerHand: Card[],
): boolean {
  // If no opponent card yet, any card is valid
  if (!opponentCard) return true;

  // Check if player has cards matching opponent's suit
  const hasMatchingSuit = playerHand.some(
    (card) => card.suit === opponentCard.suit,
  );

  // If has matching suit, must play matching suit
  if (hasMatchingSuit) {
    return selectedCard.suit === opponentCard.suit;
  }

  // Otherwise any card is valid
  return true;
}

export function evaluateTrick(
  opponentCard: Card,
  playerCard: Card,
  trump: Card,
): "player" | "opponent" {
  // If trump is played, highest trump wins
  if (playerCard.suit === trump.suit && opponentCard.suit !== trump.suit) {
    return "player";
  }
  if (opponentCard.suit === trump.suit && playerCard.suit !== trump.suit) {
    return "opponent";
  }

  // Both trump or both non-trump, compare values
  if (playerCard.suit === opponentCard.suit) {
    return playerCard.value > opponentCard.value ? "player" : "opponent";
  }

  // Different non-trump suits, opponent (led suit) wins
  return "opponent";
}

export function countSuitWins(cards: Card[]): Record<Suit, number> {
  const counts: Record<Suit, number> = {
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0,
  };

  for (const card of cards) {
    counts[card.suit]++;
  }

  return counts;
}

export function getPlayerStats(state: GameState): PlayerStats {
  return {
    player: countSuitWins(state.tricksWon.player),
    opponent: countSuitWins(state.tricksWon.opponent),
  };
}

export function canPlayCards(playerHand: Card[], opponentCard: Card): Card[] {
  const matchingSuit = playerHand.filter(
    (card) => card.suit === opponentCard.suit,
  );
  return matchingSuit.length > 0 ? matchingSuit : playerHand;
}
