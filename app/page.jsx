import Link from "next/link";
import Header from "./components/Header";
import styles from "./style/page.module.css";
import "./globals.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Header transparent/>

      <main className={styles.hero}>
        <div className={styles.card}>
          <div className={styles.brand}>
            <div className={styles.logo}>MUV</div>
            <div className={styles.sub}>Study AI</div>
          </div>

          <h1 className={styles.title}>
            Otimização do Estudo Através da Inteligência Artificial
          </h1>

          <p className={styles.lead}>
            Tenha um assistente de estudos disponível 24h para resumir textos,
            tirar dúvidas, gerar quizzes e personalizar sua rotina de
            aprendizado.
          </p>

          <p className={styles.description}>
            Nosso projeto demonstra como modelos avançados podem tornar o estudo
            mais eficiente, interativo e adaptado ao seu ritmo. Experimente a
            conversa com a IA e veja os resultados na prática.
          </p>

          <div className={styles.actions}>
            <Link href="/chat" className={styles.cta}>
              Conversar com a IA
            </Link>
            <a href="/projeto" className={styles.ghost}>
              Saber mais
            </a>
          </div>

          <div className={styles.hint}>
            Conversas seguras e personalizadas — teste com exemplos ou suas
            dúvidas.
          </div>
        </div>
      </main>
    </div>
  );
}
