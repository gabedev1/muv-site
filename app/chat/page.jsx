"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Rolagem automática para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    // Adiciona mensagem do usuário
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          // Envia o histórico se quiser contexto (opcional)
          history: messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-4),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Erro ${res.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // O servidor agora retorna { text, raw } — aceitar esse formato
      let responseText = "";
      if (data.text) {
        responseText = data.text;
      } else if (data.candidates && data.candidates.length > 0) {
        responseText = data.candidates[0].content?.parts?.[0]?.text || "";
      } else if (data.contents && data.contents.length > 0) {
        responseText = data.contents[0].parts?.[0]?.text || "";
      } else if (data.raw) {
        // tentar extrair do raw quando presente
        if (data.raw.candidates && data.raw.candidates.length > 0) {
          responseText = data.raw.candidates[0].content?.parts?.[0]?.text || "";
        } else if (data.raw.contents && data.raw.contents.length > 0) {
          responseText = data.raw.contents[0].parts?.[0]?.text || "";
        }
      }

      if (!responseText) {
        throw new Error("A API retornou uma resposta vazia ou inesperada");
      }

      // Adiciona resposta da IA
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: responseText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message || "Erro ao conectar com a API");

      // Adiciona mensagem de erro ao histórico
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "error",
          content: `Erro: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <div className={styles.chatWrap}>
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <Header />
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-500 text-purple-600 mt-6 mb-6">
            Assistente de Estudos com IA
          </h1>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-black-600 transition duration-200"
            >
              🗑️ Limpar Chat
            </button>
          )}
        </div>

        {/* Área de Mensagens */}
        <div
          className={`${styles.messagesArea} flex-1 overflow-y-auto mb-4 border border-gray-400 rounded-lg p-4`}
        >
          {messages.length === 0 ? (
            <div className="text-center text-purple-900 mt-8">
              <div className="text-6xl mb-4 pt-5">🎓</div>
              <h2 className="text-xl font-semibold mb-2">
                Bem-vindo ao Assistente de Estudos!
              </h2>
              <p>
                Faça uma pergunta sobre qualquer matéria e eu ajudarei você.
              </p>
              <p className="text-sm mt-2 pb-8">
                Exemplo: "Explique o que é fotossíntese"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-purple-800 text-white-100 "
                        : message.role === "error"
                        ? "bg-red-100 border border-red-300 text-red-700"
                        : "bg-black border border-gray-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold">
                        {message.role === "user"
                          ? "👤 Você"
                          : message.role === "error"
                          ? "❌ Erro"
                          : "🤖 Assistente"}
                      </span>
                      <span className="text-xs ml-2 opacity-70">
                        {message.timestamp}
                      </span>
                    </div>

                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-gray-500 text-lg font-bold mt-3 mb-2"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-md font-bold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-sm font-bold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="mb-2 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-inside mb-2 space-y-1"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-purple-700" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto my-1"
                                  {...props}
                                />
                              ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="bg-gray-100 border-l-4 border-blue-500 pl-3 italic text-purple-600 my-2"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-black border border-gray-200 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center">
                      <div className="animate-pulse flex space-x-2">
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">
                        Digitando...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Formulário de Input */}
        <form onSubmit={handleSubmit} className="border-t pt-4">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta sobre estudos..."
              rows="3"
              className={`${styles.textarea} flex-1 p-2 border rounded-lg focus:outline-none resize-none`}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`${styles.sendButton} px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition duration-200 self-end`}
            >
              {loading ? "⏳" : "📤"}
            </button>
          </div>
          <p className="text-xs text-black-500 mt-1">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </form>

        {error && !loading && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mt-2">
            <strong>❌ Erro:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
