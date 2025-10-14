'use client';

import styles from "./Header.module.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className={styles["muv-header"]} role="banner">
      <div className={styles.container}>
        <h2 className={styles.logo}>MUV</h2>

        <nav className={styles.navWrap} role="navigation" aria-label="Main">
          <ul className={styles.nav}>
            <li>
              <a href="/" className={`${styles["nav-link"]} ${isActive('/')}`}>
                Início
              </a>
            </li>
            <li>
              <a href="/projeto" className={styles["nav-link"]}>
                Sobre
              </a>
            </li>
            <li>
              <a href="/sobre" className={styles["nav-link"]}>
                Grupo
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
