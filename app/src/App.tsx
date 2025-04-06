import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    addEventListener("load", () => {
      window.parent.postMessage({ type: "webViewReady" }, "*");
    });

    window.addEventListener("message", (event) => {
      if (event.data.type === "devvit-message") {
        const message = event.data.data.message;

        switch (message.type) {
          case "game_created":
            setGameId(message.data.gameId);
            console.log("Game created:", message.data.gameId);
            break;
        }
      }
    });
  }, []);

  const handleCreateGame = () => {
    window.parent.postMessage(
      {
        type: "create_game",
        data: { clicked: true },
      },
      "*"
    );
  };

  const handleJoinGame = () => {
    window.parent.postMessage(
      {
        type: "join_game",
        data: { gameId },
      },
      "*"
    );
  };

  return (
    <>
      <h1>Multiplayer Hangman</h1>
      <div style={{ display: "grid", justifyContent: "center", gap: ".5rem" }}>
        <button onClick={handleCreateGame}>Create game</button>
        <p>or</p>
        <input
          style={{ padding: " .4rem" }}
          type="text"
          placeholder="Enter game id"
          onChange={(e) => setGameId(e.target.value)}
        />
        <button disabled={!gameId} onClick={handleJoinGame}>
          Join game
        </button>
      </div>
    </>
  );
}

export default App;
