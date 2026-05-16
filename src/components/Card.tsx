import type { Card as CardType } from "../types";
import { SUIT_SYMBOLS, SUIT_COLORS } from "../gameLogic";
import "./Card.css";

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isPlayable?: boolean;
  willWin?: boolean;
  isInHand?: boolean;
  onClick?: () => void;
  faceDown?: boolean;
}

export function Card({
  card,
  isSelected,
  isPlayable,
  willWin,
  isInHand = false,
  onClick,
  faceDown,
}: CardProps) {
  if (faceDown) {
    return <div className="card card--facedown" />;
  }

  const color = SUIT_COLORS[card.suit];

  let cardClasses = "card";
  if (isSelected) cardClasses += " card--selected";
  if (isInHand && !isPlayable) cardClasses += " card--unplayable";
  if (isPlayable && willWin === true) cardClasses += " card--will-win";
  if (isPlayable && willWin === false) cardClasses += " card--will-lose";

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={
        {
          "--suit-color": color,
        } as React.CSSProperties
      }
    >
      <div className="card__value">{card.value}</div>
      <div className="card__suit">{SUIT_SYMBOLS[card.suit]}</div>
    </div>
  );
}
