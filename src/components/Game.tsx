import { useState, useEffect } from "react";

import type { GameState, Card as CardType } from "../types";
import {
  initializeGame,
  drawOpponentCard,
  evaluateTrick,
  canPlayCards,
  getPlayerStats,
} from "../gameLogic";
import { Board } from "./Board";
import { Hand } from "./Hand";
import { Stats } from "./Stats";
import { GameOver } from "./GameOver";
import "./Game.css";

type ChangedStats = {
  playerWins?: boolean;
  opponentWins?: boolean;
  suits?: Set<string>;
};

export function Game() {
  const [gameState, setGameState] = useState<GameState>(initializeGame);
  const [playableCardIds, setPlayableCardIds] = useState<string[]>([]);
  const [changedStats, setChangedStats] = useState<ChangedStats>({});
  const [cardOutcomes, setCardOutcomes] = useState<Record<string, boolean>>({});

  // Draw opponent card at the start of each trick
  useEffect(() => {
    if (
      !gameState.gameOver &&
      !gameState.currentOpponentCard &&
      gameState.deck.length > 0
    ) {
      const opponentCard = drawOpponentCard(gameState);
      setGameState((prev) => ({
        ...prev,
        currentOpponentCard: opponentCard,
      }));
    }
  }, [gameState.trickNumber, gameState.gameOver]);

  // Update playable cards and calculate outcomes when opponent card is drawn
  useEffect(() => {
    if (gameState.currentOpponentCard && gameState.hand.player.length > 0) {
      const playable = canPlayCards(
        gameState.hand.player,
        gameState.currentOpponentCard,
      );
      setPlayableCardIds(playable.map((card) => card.id));

      // Calculate win/lose outcomes for each playable card
      const outcomes: Record<string, boolean> = {};
      playable.forEach((card) => {
        const winner = evaluateTrick(
          gameState.currentOpponentCard!,
          card,
          gameState.trump!,
        );
        outcomes[card.id] = winner === "player";
      });
      setCardOutcomes(outcomes);
    }
  }, [gameState.currentOpponentCard, gameState.hand.player, gameState.trump]);

  const handleCardSelect = (card: CardType) => {
    // Only allow selection of playable cards
    if (!playableCardIds.includes(card.id)) {
      return;
    }

    if (!gameState.currentOpponentCard) return;

    // Evaluate the trick immediately
    const winner = evaluateTrick(
      gameState.currentOpponentCard,
      card,
      gameState.trump!,
    );

    const playerCard = card;
    const opponentCard = gameState.currentOpponentCard;

    // Remove played card from hand
    const newPlayerHand = gameState.hand.player.filter(
      (c) => c.id !== playerCard.id,
    );

    // Update state for next trick or game over
    const newTrickNumber = gameState.trickNumber + 1;
    const isGameOver = newTrickNumber > 10;

    const newPlayerWins =
      winner === "player" ? gameState.playerWins + 1 : gameState.playerWins;
    const newOpponentWins =
      winner === "opponent"
        ? gameState.opponentWins + 1
        : gameState.opponentWins;

    const newTricksWon = {
      player:
        winner === "player"
          ? [...gameState.tricksWon.player, playerCard, opponentCard]
          : gameState.tricksWon.player,
      opponent:
        winner === "opponent"
          ? [...gameState.tricksWon.opponent, playerCard, opponentCard]
          : gameState.tricksWon.opponent,
    };

    // Track which stats changed
    const changed: ChangedStats = {};
    if (newPlayerWins !== gameState.playerWins) {
      changed.playerWins = true;
    }
    if (newOpponentWins !== gameState.opponentWins) {
      changed.opponentWins = true;
    }

    // Track which suits changed
    if (winner === "player") {
      changed.suits = new Set([playerCard.suit, opponentCard.suit]);
    }

    setChangedStats(changed);

    // Clear changed stats after animation
    setTimeout(() => setChangedStats({}), 600);

    setGameState((prev) => ({
      ...prev,
      hand: {
        ...prev.hand,
        player: newPlayerHand,
      },
      tricksWon: newTricksWon,
      playerWins: newPlayerWins,
      opponentWins: newOpponentWins,
      selectedCard: null,
      currentOpponentCard: null,
      trickNumber: newTrickNumber,
      gameOver: isGameOver,
    }));

    setPlayableCardIds([]);
  };

  const handlePlayAgain = () => {
    setGameState(initializeGame());
    setPlayableCardIds([]);
    setChangedStats({});
  };

  if (gameState.gameOver) {
    return (
      <GameOver
        playerWins={gameState.playerWins}
        opponentWins={gameState.opponentWins}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const stats = getPlayerStats(gameState);

  return (
    <div className="game">
      <div className="game__stats-container">
        <Stats
          playerWins={gameState.playerWins}
          opponentWins={gameState.opponentWins}
          stats={stats}
          changedStats={changedStats}
        />
      </div>

      <div className="game__main">
        <Board
          trump={gameState.trump}
          opponentCard={gameState.currentOpponentCard}
          playerCard={gameState.selectedCard}
          deckRemaining={gameState.deck.length}
          trickNumber={gameState.trickNumber}
        />
      </div>

      <footer className="game__footer">
        <div className="game__footer-label">Your Hand</div>
        <Hand
          cards={[...gameState.hand.player].sort((a, b) => {
            const suitOrder = { hearts: 0, diamonds: 1, clubs: 2, spades: 3 };
            const suitA = suitOrder[a.suit];
            const suitB = suitOrder[b.suit];
            if (suitA !== suitB) return suitA - suitB;
            return a.value - b.value;
          })}
          selectedCardId={gameState.selectedCard?.id}
          playableCardIds={playableCardIds}
          cardOutcomes={cardOutcomes}
          onCardClick={handleCardSelect}
        />
      </footer>
    </div>
  );
}
