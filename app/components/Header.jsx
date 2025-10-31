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
        <Header />
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
          {/* simples ícone SVG */}
          <a
            href="https://github.com/gabedev1/muv-site"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={styles.social}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
        3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
        0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
        -.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 
        1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998 
        .107-.776.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 
        0-1.31.465-2.382 1.235-3.22-.135-.304-.54-1.524.105-3.176 
        0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405 
        c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 
        3.285-1.23 .645 1.653.24 2.873.12 3.176 
        .765.838 1.23 1.91 1.23 3.22 
        0 4.61-2.805 5.625-5.475 5.92 
        .42.36.81 1.096.81 2.22 
        0 1.606-.015 2.896-.015 3.286 
        0 .315.21.69.825.57 
        C20.565 22.092 24 17.592 24 12.297 
        c0-6.627-5.373-12-12-12"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
