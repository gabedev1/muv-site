'use client';
import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input 
        }),
      });

      const data = await res.json();
      console.log("Resposta completa da API:", data);

      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status}: ${res.statusText}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      let responseText = "";

      if (data.candidates && data.candidates.length > 0) {
        responseText = data.candidates[0].content?.parts[0]?.text || "Resposta vazia";
      } else if (data.contents && data.contents.length > 0) {
        responseText = data.contents[0].parts[0]?.text || "Resposta vazia";
      } else {
        throw new Error("Estrutura da resposta inesperada");
      }

      if (!responseText || responseText === "Resposta vazia") {
        throw new Error("A API retornou uma resposta vazia");
      }

      setResponse(responseText);

    } catch (err) {
      console.error("Erro detalhado:", err);
      setError(err.message || "Erro ao conectar com a API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Assistente de Estudos com IA
      </h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta sobre estudos... Exemplo: 'Explique o que é fotossíntese'"
          rows="4"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={loading}
        />
        
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-200"
        >
          {loading ? "🔄 Processando..." : "📤 Enviar Pergunta"}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-4">
          <strong>❌ Erro:</strong> {error}
        </div>
      )}

      {response && (
        <div className="p-6 bg-black border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-purple-800 border-b pb-2">
            💡 Resposta:
          </h3>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                // Personalização dos componentes Markdown
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-purple-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-purple-800" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-purple-700" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-white-700 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="text-white-700" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-purple-900" {...props} />,
                em: ({node, ...props}) => <em className="italic text-purple-800" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-black-100 px-1 py-0.5 rounded text-sm font-mono text-white-600" {...props} />
                    : <code className="block bg-black-100 p-3 rounded text-sm font-mono text-purple-800 overflow-x-auto my-2" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-white-600 my-4" {...props} />,
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}