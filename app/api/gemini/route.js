export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "API key não configurada" }, { status: 500 });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Você é um assistente de estudos. 
            
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

            Pergunta do estudante: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048, // Aumentei para respostas mais completas
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ 
        error: data.error?.message || "Erro na API Gemini" 
      }, { status: response.status });
    }

    return Response.json(data);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}