"use client";

import Link from "next/link";
import Header from "../components/Header";
import styles from "./sobre.module.css";

export default function Sobre() {
  const integrantes = [
    { nome: "João Gabriel", nota: "Desenvolvedor Geral e Gerenciador da API" },
    { nome: "Ana Vitória", nota: "Idealizadora do Projeto" },
    { nome: "Pedro Vitor", nota: "Responsável pelo UX e UI" },
    { nome: "Valdinar Filho", nota: "Responsável pelo Design" },
  ];

  return (
    <main className={styles.sobreContainer}>
      <Header transparent/>
      <div className={styles.sobreContent}>
        <div className={styles.sobreCard}>
          <h1 className={styles.sobreTitle}>Sobre Nós</h1>
          <p className={styles.sobreText}>
            Conheça os integrantes do nosso time:
          </p>

          <ul className={styles.integrantesList}>
            {integrantes.map((int, idx) => (
              <li key={idx} className={styles.integranteItem}>
                <span className={styles.integranteName}>{int.nome}</span>
                <p className={styles.exclaim}>{int.nota}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
