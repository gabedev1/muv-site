import Link from "next/link";
import React from "react";
import styles from "../style/about.module.css";

export default function AboutProject() {
    return (
        <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
            <h1 className={styles.h1}>Sobre o Projeto</h1>
            <p>
                Este projeto foi desenvolvido com o objetivo de apresentar uma solução moderna e eficiente para divulgação de informações, serviços e iniciativas relacionadas ao tema proposto. Utilizando tecnologias atuais como React e Next.js, buscamos criar uma experiência de navegação intuitiva, responsiva e acessível para todos os usuários.
            </p>
            <h2 className={styles.h2}>Objetivos</h2>
            <ul className={styles.ul}>
                <li className={styles.li}>Facilitar o acesso a informações relevantes sobre o projeto.</li>
                <li className={styles.li}>Promover a interação e o engajamento dos visitantes.</li>
                <li className={styles.li}>Oferecer uma plataforma confiável e de fácil utilização.</li>
            </ul>
            <h2 className={styles.h2}>Tecnologias Utilizadas</h2>
            <ul className={styles.ul}>
                <li className={styles.li}>React</li>
                <li className={styles.li}>Next.js</li>
                <li className={styles.li}>JavaScript</li>
                <li className={styles.li}>CSS Modules</li>
            </ul>
            <p className={styles.p}>
                Esperamos que este projeto contribua positivamente para a comunidade e seja uma fonte útil de informações e inspiração.
            </p>
        </main>
    );
}
