import type { Card as CardType } from "../types";
import { Card } from "./Card";
import "./Hand.css";

interface HandProps {
  cards: CardType[];
  selectedCardId?: string;
  playableCardIds?: string[];
  cardOutcomes?: Record<string, boolean>; // true = will win, false = will lose
  onCardClick: (card: CardType) => void;
}

export function Hand({
  cards,
  selectedCardId,
  playableCardIds = [],
  cardOutcomes = {},
  onCardClick,
}: HandProps) {
  return (
    <div className="hand">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isSelected={card.id === selectedCardId}
          isPlayable={playableCardIds.includes(card.id)}
          willWin={
            playableCardIds.includes(card.id)
              ? cardOutcomes[card.id]
              : undefined
          }
          isInHand={true}
          onClick={() => onCardClick(card)}
        />
      ))}
    </div>
  );
}
