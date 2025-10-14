'use client'
export default function Sobre() {
    const integrantes = [
        { nome: "João Gabriel" },
        { nome: "Ana Vitória" },
        { nome: "Pedro Vitor" },
        { nome: "Valdinar Filho" },
    ];

    return (
        <main className="sobre-container">
            <h1 className="sobre-title">Sobre Nós</h1>
            <p className="sobre-desc">
                Conheça os integrantes do nosso time:
            </p>
            <ul className="integrantes-list">
                {integrantes.map((int, idx) => (
                    <li key={idx} className="integrante-item">
                        {int.nome}
                    </li>
                ))}
            </ul>
            <style jsx>{`
                .sobre-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #030303ff 0%, #320046ff 100%);
                    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                    padding: 2rem;
                }
                .sobre-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #c83cff94;
                    letter-spacing: -1px;
                    margin-bottom: 0.5rem;
                }
                .sobre-desc {
                    font-size: 1.2rem;
                    color: #ddddddff;
                    margin-bottom: 2rem;
                }
                .integrantes-list {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    gap: 2rem;
                }
                .integrante-item {
                    background: #fff;
                    border-radius: 1rem;
                    box-shadow: 0 4px 24px rgba(34, 34, 59, 0.08);
                    padding: 1.2rem 2rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #22223b;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .integrante-item:hover {
                    transform: translateY(-4px) scale(1.04);
                    box-shadow: 0 8px 32px rgba(34, 34, 59, 0.15);
                }
                @media (max-width: 600px) {
                    .integrantes-list {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }
            `}</style>
        </main>
    );
}