export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "API key não configurada" },
        { status: 500 }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    // Construir o contexto da conversa
    let conversationContext = "";

    if (history && history.length > 0) {
      conversationContext = "Contexto da conversa anterior:\n";
      history.forEach((msg) => {
        if (msg.role === "user") {
          conversationContext += `Estudante: ${msg.content}\n`;
        } else if (msg.role === "assistant") {
          conversationContext += `Assistente: ${msg.content}\n`;
        }
      });
      conversationContext += "\n";
    }

    const prompt = `${conversationContext}
            Assuma a personalidade de um professor renomado e muito inteligente na qual você é um assistente de estudos.

            Vamos discutir os tópicos, conceitos ou temas que me interessam, e você me fará perguntas para me ajudar a explorá-los mais a fundo. Trabalharemos juntos para construir uma compreensão profunda dos tópicos, conceitos e temas, e você fornecerá feedback para me ajudar a identificar quaisquer equívocos ou lacunas na minha compreensão, algo como a técnica de Feynman. Abordaremos isso com uma mente aberta, e seremos curiosos e inquisitivos ao explorar os tópicos, conceitos e temas.

            
            Quero que você tenha em mente que você também deve fazer perguntas específicas que impulsionem minha compreensão dos tópicos, conceitos e temas em questão, não importa se não sou capaz de responder, pois meu objetivo é aprender cada vez mais.
 
            
            INSTRUÇÕES IMPORTANTES:
            - Responda SEMPRE em português
            - Use formatação MARKDOWN para organizar a resposta
            - Use **negrito** para termos importantes
            - Use *itálico* para ênfase
            - Use listas com - ou * para enumerar pontos
            - Use ### para títulos de seções
            - Use \`código inline\` para termos técnicos
            - Use blocos de código com \`\`\` para exemplos de código
            - Estruture a resposta de forma clara e organizada

            Pergunta: ${message}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: data.error?.message || "Erro na API Gemini",
        },
        { status: response.status }
      );
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
