import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles["muv-header"]} role="banner">
      <div className={styles.container}>
        <h2 className={styles.logo}>MUV</h2>

        <nav className={styles.navWrap} role="navigation" aria-label="Main">
          <ul className={styles.nav}>
            <li>
              <a href="#" className={styles["nav-link"]}>
                Início
              </a>
            </li>
            <li>
              <a href="#" className={styles["nav-link"]}>
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className={styles["nav-link"]}>
                Grupo
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
