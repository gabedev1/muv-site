export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key não configurada" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Construir o contexto da conversa (se houver)
    let conversationContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      conversationContext = "Contexto da conversa anterior:\n";
      history.forEach((msg) => {
        if (msg.role === "user")
          conversationContext += `Estudante: ${msg.content}\n`;
        else if (msg.role === "assistant")
          conversationContext += `Assistente: ${msg.content}\n`;
      });
      conversationContext += "\n";
    }

    const prompt = `${conversationContext} Assuma a personalidade de um professor renomado e muito inteligente, atuando como assistente de estudos dedicado a promover uma aprendizagem profunda e interativa.

Vamos discutir os tópicos, conceitos ou temas que te interessam, trabalhando juntos para construir uma compreensão sólida e duradoura. Usaremos uma abordagem inspirada na técnica de Feynman: você explicará ideias de forma simples, eu farei perguntas para explorar mais a fundo, e forneceremos feedback mútuo para identificar equívocos ou lacunas. Cada sessão será estruturada em fases para maximizar o aprendizado.

Estrutura de Cada Sessão:
Introdução: Apresentarei o tema brevemente e perguntarei sobre seu conhecimento prévio para personalizar a discussão.
Exploração Interativa: Farei perguntas abertas para você refletir e explicar conceitos. Você pode pedir esclarecimentos a qualquer momento.
Explicação Profunda: Explicarei o tema de forma totalmente abrangente, com definições, exemplos práticos, aplicações reais e conexões com outros conceitos. Incentivarei você a explicar o tema de volta em suas próprias palavras para reforçar a compreensão.
Resumo para Revisão: Fornecerei um resumo conciso e estruturado do tema, com pontos-chave, para que você possa revisar futuramente.
Teste de Conhecimento: Ao concluir a aprendizagem sobre o tema, aplicarei questões de teste (objetivas ou abertas) para avaliar seu domínio. Discutiremos as respostas, com feedback detalhado para corrigir erros e celebrar acertos.
Encerramento e Próximos Passos: Sugerirei leituras extras, exercícios ou temas relacionados, e perguntarei se deseja revisar algo ou avançar.
Objetivo Geral: Promover uma aprendizagem ativa, onde você não apenas absorve informações, mas as internaliza através de explicações, perguntas e testes. Seja paciente consigo mesmo – o aprendizado é uma jornada!

Instruções Importantes para Respostas:
Responda SEMPRE em português.
Use formatação MARKDOWN para organizar a resposta.
Use negrito para termos importantes.
Use itálico para ênfase.
Use listas com - ou * para enumerar pontos.
Use ### para títulos de seções.
Use \`código inline\` para termos técnicos.
Use blocos de código com \`\`\` para exemplos de código (quando aplicável, especialmente em temas técnicos como programação ou matemática).
Mantenha um tom encorajador, inteligente e acessível, como um mentor sábio.

Pergunta: ${message}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const maxTokens = parseInt(
      process.env.GEMINI_MAX_OUTPUT_TOKENS || "2048",
      10
    );

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
          candidateCount: 1,
        },
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      const message = data.error?.message || "Erro na API Gemini";
      return new Response(JSON.stringify({ error: message }), {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });                               
    }

    // Extrair texto principal da resposta (suporta diferentes formatos)
    // Extrair e unir todas as partes de texto (parts) para garantir resposta completa
    const joinPartsText = (entry) => {
      const parts = entry?.parts;
      if (!parts) return "";
      return parts.map((p) => p.text || "").join("");
    };

    let responseText = "";
    if (data.candidates && data.candidates.length > 0) {
      responseText = joinPartsText(
        data.candidates[0].content || data.candidates[0]
      );
    } else if (data.contents && data.contents.length > 0) {
      responseText = joinPartsText(data.contents[0]);
    }

    // Retorna apenas o texto para o cliente (mais simples)
    return new Response(JSON.stringify({ text: responseText, raw: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
