import { useState } from "react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [gameId, setGameId] = useState<string | null>(null);

  const handleCreateGame = () => {
    window.parent.postMessage(
      {
        type: "create_game",
      },
      "*"
    );
  };

  const handleJoinGame = () => {
    window.parent.postMessage(
      {
        type: "join_game",
        data: { gameId: gameId?.trim() },
      },
      "*"
    );
  };

  return (
    <main className={styles.landing_container}>
      <h1>Hangman Challenge</h1>
      <div className={styles.landing_inner}>
        <button onClick={handleCreateGame}>Create game</button>
        <span>or</span>
        <input
          type="text"
          placeholder="Enter game id"
          onChange={(e) => setGameId(e.target.value)}
        />
        <button disabled={!gameId} onClick={handleJoinGame}>
          Join game
        </button>
      </div>
    </main>
  );
}
