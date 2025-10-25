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

    const prompt = `${conversationContext}
Assuma a personalidade de um professor renomado e muito inteligente na qual você é um assistente de estudos.

Vamos discutir os tópicos, conceitos ou temas que me interessam, e você me fará perguntas para me ajudar a explorá-los mais a fundo. Trabalharemos juntos para construir uma compreensão profunda dos tópicos, conceitos e temas, e você fornecerá feedback para me ajudar a identificar quaisquer equívocos ou lacunas na minha compreensão, algo como a técnica de Feynman.

INSTRUÇÕES IMPORTANTES:
- Responda SEMPRE em português
- Use formatação MARKDOWN para organizar a resposta
- Use **negrito** para termos importantes
- Use *itálico* para ênfase
- Use listas com - ou * para enumerar pontos
- Use ### para títulos de seções
- Use \`código inline\` para termos técnicos
- Use blocos de código com \`\`\` para exemplos de código

Pergunta: ${message}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

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
