import Link from "next/link";
import React from "react";
import styles from "./projeto.module.css";

export default function AboutProject() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.h1}>Sobre o Projeto</h1>
          <p className={styles.lead}>
            Solução moderna e eficiente para divulgação de informações e
            demonstração de integração com IA — criada com React e Next.js.
          </p>
        </header>

        <article className={styles.section}>
          <h2 className={styles.h2}>Objetivos</h2>
          <ul className={styles.ul}>
            <li className={styles.li}>
              Facilitar o acesso a informações relevantes.
            </li>
            <li className={styles.li}>
              Promover interação e engajamento dos visitantes.
            </li>
            <li className={styles.li}>
              Oferecer uma plataforma confiável e intuitiva.
            </li>
          </ul>
        </article>

        <article className={styles.section}>
          <h2 className={styles.h2}>Tecnologias Utilizadas</h2>
          <ul className={styles.techGrid}>
            <li className={styles.tech}>React</li>
            <li className={styles.tech}>Next.js</li>
            <li className={styles.tech}>JavaScript</li>
            <li className={styles.tech}>CSS Modules</li>
          </ul>
        </article>

        <footer className={styles.footer}>
          <p className={styles.p}>
            Esperamos que este projeto inspire a comunidade e mostre como IA
            pode melhorar a experiência de aprendizagem e demonstração em feiras
            de ciências.
          </p>
          <Link href="/" className={styles.cta}>
            Voltar à Página Inicial
          </Link>
        </footer>
      </section>
    </main>
  );
}
