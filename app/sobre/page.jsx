"use client";

import Link from "next/link";
import Header from "../components/Header";
import styles from "./sobre.module.css";

export default function Sobre() {
  const integrantes = [
    { nome: "João Gabriel", nota: "Líder do projeto" },
    { nome: "Ana Vitória", nota: "Especialista em UX e protótipos" },
    { nome: "Pedro Vitor", nota: "Responsável pela integração com IA" },
    { nome: "Valdinar Filho", nota: "Desenvolvimento e demonstração" },
  ];

  return (
    <main className={styles.sobreContainer}>
      <Header />
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
