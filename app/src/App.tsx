import { useEffect, useState } from "react";
import "./App.css";
import { Outlet } from "react-router";

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
          case "join_game":
            console.log("Game created:", message.data.gameId, gameId);
            break;
        }
      }
    });
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
