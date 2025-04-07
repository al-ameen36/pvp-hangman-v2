import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router";
import { useAppDispatch } from "./store/store";
import { setGame } from "./store/slices/app";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    addEventListener("load", () => {
      window.parent.postMessage({ type: "webViewReady" }, "*");
    });

    window.addEventListener("message", (event) => {
      if (event.data.type === "devvit-message") {
        const message = event.data.data.message;

        switch (message.type) {
          case "game_created":
            dispatch(setGame(message.data.game));
            console.log("Game created: ", message.data.game);
            break;
          case "game_joined":
            dispatch(setGame(message.data.game));
            console.log("Game joined: ", message.data.game);
            navigate("/word");
            break;
          case "opponent_joined":
            dispatch(setGame(message.data.game));
            console.log("Game joined: ", message.data.game);
            navigate("/word");
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
