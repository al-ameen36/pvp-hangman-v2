import styles from "./loader.module.css";

export default function Loader() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.cube}>
          <div className={styles.cube__inner}></div>
        </div>
        <div className={styles.cube}>
          <div className={styles.cube__inner}></div>
        </div>
        <div className={styles.cube}>
          <div className={styles.cube__inner}></div>
        </div>
      </div>
    </div>
  );
}
