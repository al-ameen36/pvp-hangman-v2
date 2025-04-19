import { useState } from "react";
import styles from "./word.module.css";
import { useAppSelector } from "../../store/store";
import { selectGame, selectIsReady } from "../../store/slices/app";
import Loader from "../../components/loader/loader";

export default function WordPage() {
  const game = useAppSelector(selectGame);
  const isReady = useAppSelector(selectIsReady);
  const [word, setWord] = useState("");

  const handleChooseWord = () => {
    window.parent.postMessage(
      {
        type: "choose_word",
        data: { gameId: game?.gameId, word },
      },
      "*"
    );
  };

  return (
    <main className={styles.landing_container}>
      <h1>Hangman Challenge</h1>
      <div className={styles.landing_inner}>
        <h3>Join game with -- {game?.gameId} --</h3>
        {isReady ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <Loader />
            <p>You are ready and Waiting for opponent</p>
          </div>
        ) : (
          <div>
            <p>Enter a word your opponent should guess</p>
            {/* Add rules here */}
            <input
              type="text"
              placeholder="Elephant"
              onChange={(e) => setWord(e.target.value)}
            />
            <button
              disabled={!word}
              onClick={handleChooseWord}
              style={{ marginTop: "1rem" }}
            >
              I'm Ready
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
