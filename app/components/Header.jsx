"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <header className={styles["muv-header"]} role="banner">
      <div className={styles.container}>
        {/* left: logo image */}
        <div className={styles.left}>
          <Link href="/" className={styles.logoLink}>
            <img src="/Logo-Muv.png" alt="MUV" className={styles.logoImg} />
          </Link>
        </div>

        {/* center: nav (centralizado) */}
        <nav className={styles.centerNav} role="navigation" aria-label="Main">
          <ul className={styles.nav}>
            <li>
              <Link
                href="/"
                className={`${styles["nav-link"]} ${
                  isActive("/") ? styles.active : ""
                }`}
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                href="/projeto"
                className={`${styles["nav-link"]} ${
                  isActive("/projeto") ? styles.active : ""
                }`}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className={`${styles["nav-link"]} ${
                  isActive("/sobre") ? styles.active : ""
                }`}
              >
                Grupo
              </Link>
            </li>
          </ul>
        </nav>

        {/* right: redes sociais */}
        <div className={styles.right}>
          <a
            href="https://www.instagram.com/gabriells.v/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={styles.social}
          >
            {/* simples ícone SVG */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm5 6.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm4.8-.9a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"
                fill="currentColor"
              />
            </svg>
          </a>

          <a
            href="https://github.com/gabedev1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={styles.social}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 1.9-1.1-.6-.1-1.2-.4-1.2-1.6 0-.4.1-.8.4-1.1-1.1-.1-2.3-.6-2.3-2.5 0-.6.2-1.1.6-1.5 0-.1-.2-.7.1-1.5 0 0 .5-.2 1.6.6a5.4 5.4 0 012.9 0c1.1-.8 1.6-.6 1.6-.6.3.8.1 1.4.1 1.5.4.4.6.9.6 1.5 0 1.9-1.2 2.4-2.3 2.5.3.3.5.7.5 1.4v2.1c0 .3.2.7.8.6A12 12 0 0012 .5z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
