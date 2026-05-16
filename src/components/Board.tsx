import type { Card as CardType } from "../types";
import { Card } from "./Card";
import "./Board.css";

interface BoardProps {
  trump: CardType | null;
  opponentCard: CardType | null;
  playerCard: CardType | null;
  deckRemaining: number;
  trickNumber: number;
}

export function Board({
  trump,
  opponentCard,
  playerCard,
  deckRemaining,
  trickNumber,
}: BoardProps) {
  return (
    <div className="board">
      <div className="board__header">
        <h2 className="board__title">Trick {trickNumber}/10</h2>
        <div className="board__deck-info">Deck: {deckRemaining} left</div>
      </div>

      <div className="board__top">
        <div className="board__trump-section">
          <label className="board__label">Trump</label>
          {trump && <Card card={trump} />}
        </div>
      </div>

      <div className="board__play-area">
        <div className="board__play-slot">
          <label className="board__label">Opponent plays</label>
          {opponentCard && <Card card={opponentCard} />}
        </div>

        <div className="board__play-slot">
          <label className="board__label">You play</label>
          {playerCard && <Card card={playerCard} />}
        </div>
      </div>
    </div>
  );
}
