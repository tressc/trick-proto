import "./GameOver.css";

interface GameOverProps {
  playerWins: number;
  opponentWins: number;
  onPlayAgain: () => void;
}

export function GameOver({
  playerWins,
  opponentWins,
  onPlayAgain,
}: GameOverProps) {
  const playerWon = playerWins > opponentWins;

  return (
    <div className="game-over">
      <div className="game-over__content">
        <h2 className="game-over__title">Game Over!</h2>
        <div className="game-over__result">
          <div
            className={`game-over__winner ${playerWon ? "game-over__winner--player" : ""}`}
          >
            {playerWon ? "🎉" : "😢"}
          </div>
          <p className="game-over__message">
            {playerWon ? "You won!" : "Opponent won!"}
          </p>
          <p className="game-over__score">
            {playerWins} - {opponentWins}
          </p>
        </div>
        <button className="game-over__button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
