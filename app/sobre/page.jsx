"use client";

import { useState } from "react";
import Header from "../components/Header";
import styles from "./sobre.module.css";

export default function Sobre() {
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);

  const integrantes = [
    {
      nome: "João Gabriel",
      nota: "Desenvolvedor Geral e Gerenciador da API",
      nomeCompleto: "João Gabriel",
      turma: "2º Ano Informática",
      turno: "Matutino",
      explicacao:
        "Responsável por toda a arquitetura do projeto, integração com a API do Google Gemini e desenvolvimento das rotas server-side. Implementou o sistema de chat e garantiu a segurança da chave de API através de rotas protegidas.",
    },
    {
      nome: "Ana Vitória",
      nota: "Idealizadora do Projeto",
      nomeCompleto: "Ana Vitória",
      turma: "2º Ano Informática",
      turno: "Matutino",
      explicacao:
        "Concebeu a ideia inicial do projeto, definiu os objetivos e o propósito educacional da plataforma. Contribuiu com o planejamento estratégico e a visão geral da aplicação.",
    },
    {
      nome: "Pedro Vitor",
      nota: "Responsável pelo UX e UI",
      nomeCompleto: "Pedro Vitor",
      turma: "2º Ano Informática",
      turno: "Matutino",
      explicacao:
        "Desenvolveu toda a experiência do usuário (UX) e a interface visual (UI) do site. Criou layouts responsivos, definiu paleta de cores, tipografia e garantiu usabilidade em diferentes dispositivos.",
    },
    {
      nome: "Valdinar Filho",
      nota: "Responsável pelo Design",
      nomeCompleto: "Valdinar Filho",
      turma: "2º Ano Informática",
      turno: "Matutino",
      explicacao:
        "Criou os elementos visuais, ilustrações e design gráfico do projeto. Desenvolveu a identidade visual, incluindo logos, ícones e composições estéticas que complementam a experiência do usuário.",
    },
  ];

  const handleIntegranteClick = (integrante) => {
    setSelectedIntegrante(integrante);
  };

  const closeModal = () => {
    setSelectedIntegrante(null);
  };

  return (
    <main className={styles.sobreContainer}>
      <Header transparent />
      <div className={styles.sobreContent}>
        <div className={styles.sobreCard}>
          <h1 className={styles.sobreTitle}>Sobre Nós</h1>
          <p className={styles.sobreText}>
            Conheça os integrantes do nosso time:
          </p>

          <ul className={styles.integrantesList}>
            {integrantes.map((int, idx) => (
              <li
                key={idx}
                className={styles.integranteItem}
                onClick={() => handleIntegranteClick(int)}
              >
                <span className={styles.integranteName}>{int.nome}</span>
                <p className={styles.exclaim}>{int.nota}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal com informações detalhadas */}
      {selectedIntegrante && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={closeModal}
              aria-label="Fechar"
            >
              ×
            </button>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedIntegrante.nome}</h2>
              <p className={styles.modalRole}>{selectedIntegrante.nota}</p>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nome Completo:</span>
                  <span className={styles.infoValue}>
                    {selectedIntegrante.nomeCompleto}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Turma:</span>
                  <span className={styles.infoValue}>
                    {selectedIntegrante.turma}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Turno:</span>
                  <span className={styles.infoValue}>
                    {selectedIntegrante.turno}
                  </span>
                </div>
              </div>
              <div className={styles.modalExplanation}>
                <h3 className={styles.explanationTitle}>
                  Contribuição no Projeto
                </h3>
                <p className={styles.explanationText}>
                  {selectedIntegrante.explicacao}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
