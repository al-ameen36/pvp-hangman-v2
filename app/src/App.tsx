import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router";
import { useAppDispatch } from "./store/store";
import { setGame, setIsReady } from "./store/slices/app";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLoad = () => {
      window.parent.postMessage({ type: "webViewReady" }, "*");
    };

    // Use load event if document is still loading
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "devvit-message") {
        const message = event.data.data.message;

        switch (message.type) {
          case "game_created":
            console.log("Game created: ", message.data.game);
            dispatch(setGame(message.data.game));
            navigate("/word");
            break;
          case "player_joined":
            console.log("You joined game");
            dispatch(setGame(message.data.game));
            navigate("/word");
            break;
          case "player_ready":
            console.log("You are ready");
            dispatch(setIsReady(true));

            if (message.data.game.team2) console.log("all set");
            else console.log("team2 not set yet");
            // Stay on the current page waiting for opponent
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
