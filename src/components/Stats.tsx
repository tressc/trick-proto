import type { PlayerStats } from "../types";
import { SUIT_SYMBOLS, SUIT_COLORS } from "../gameLogic";
import "./Stats.css";

type ChangedStats = {
  playerWins?: boolean;
  opponentWins?: boolean;
  suits?: Set<string>;
};

interface StatsProps {
  playerWins: number;
  opponentWins: number;
  stats: PlayerStats;
  changedStats?: ChangedStats;
}

export function Stats({
  playerWins,
  opponentWins,
  stats,
  changedStats = {},
}: StatsProps) {
  const suits = ["hearts", "diamonds", "clubs", "spades"] as const;

  return (
    <div className="stats">
      <div className="stats__section">
        <h3 className="stats__title">You</h3>
        <div
          className={`stats__tricks ${changedStats.playerWins ? "stats__tricks--highlight" : ""}`}
        >
          {playerWins} trick{playerWins !== 1 ? "s" : ""}
        </div>
        <div className="stats__suits">
          {suits.map((suit) => (
            <div
              key={suit}
              className={`stats__suit ${changedStats.suits?.has(suit) ? "stats__suit--highlight" : ""}`}
            >
              <span
                className="stats__suit-icon"
                style={{ color: SUIT_COLORS[suit] }}
              >
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="stats__suit-count">{stats.player[suit]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats__divider" />

      <div className="stats__section">
        <h3 className="stats__title">Opponent</h3>
        <div
          className={`stats__tricks ${changedStats.opponentWins ? "stats__tricks--highlight" : ""}`}
        >
          {opponentWins} trick{opponentWins !== 1 ? "s" : ""}
        </div>
        <div className="stats__suits">
          {suits.map((suit) => (
            <div key={suit} className="stats__suit">
              <span
                className="stats__suit-icon"
                style={{ color: SUIT_COLORS[suit] }}
              >
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="stats__suit-count">{stats.opponent[suit]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
