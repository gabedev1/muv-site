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
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + "px";
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setError("");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString("pt-BR", { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
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

      let responseText = "";
      if (data.text) {
        responseText = data.text;
      } else {
        const joinParts = (entry) => {
          const parts = entry?.parts || [];
          return parts.map((p) => p.text || "").join("");
        };

        if (data.candidates && data.candidates.length > 0) {
          const candidate = data.candidates[0];
          responseText = candidate.content
            ? joinParts(candidate.content)
            : joinParts(candidate);
        } else if (data.contents && data.contents.length > 0) {
          responseText = joinParts(data.contents[0]);
        } else if (data.raw) {
          if (data.raw.candidates && data.raw.candidates.length > 0) {
            const candidate = data.raw.candidates[0];
            responseText = candidate.content
              ? joinParts(candidate.content)
              : joinParts(candidate);
          } else if (data.raw.contents && data.raw.contents.length > 0) {
            responseText = joinParts(data.raw.contents[0]);
          }
        }
      }

      if (!responseText) {
        throw new Error("A API retornou uma resposta vazia ou inesperada");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: responseText,
          timestamp: new Date().toLocaleTimeString("pt-BR", { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        },
      ]);
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message || "Erro ao conectar com a API");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "error",
          content: `Erro: ${err.message}`,
          timestamp: new Date().toLocaleTimeString("pt-BR", { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
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
      {/* Header fixo no topo */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Conteúdo principal com padding para o header */}
      <div className="w-full max-w-4xl mx-auto h-screen flex flex-col pt-20 px-4 sm:px-6 lg:px-8">
        
        {/* Título e botão limpar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-purple-900 mb-2">
              Assistente de Estudos com IA
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Faça perguntas sobre qualquer matéria e receba ajuda instantânea
            </p>
          </div>
          
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-200 text-sm font-medium whitespace-nowrap shadow-lg"
            >
              🗑️ Limpar Chat
            </button>
          )}
        </div>

        {/* Área de Mensagens - Ocupa espaço restante */}
        <div className={`${styles.messagesArea} flex-1 mb-4 rounded-xl shadow-2xl`}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white text-center p-8">
              <div className="text-6xl mb-6">🎓</div>
              <h2 className="text-purple-700 text-2xl font-bold mb-4">
                Bem-vindo ao Assistente de Estudos!
              </h2>
              <p className="text-lg mb-2 text-purple-500">
                Faça uma pergunta sobre qualquer matéria e eu ajudarei você.
              </p>
              <p className="text-purple-500 italic">
                Exemplo: "Explique o que é fotossíntese"
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${styles.msg} ${
                      message.role === "user"
                        ? styles.user
                        : message.role === "error"
                        ? styles.error
                        : styles.assistant
                    } max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">
                        {message.role === "user"
                          ? "👤 Você"
                          : message.role === "error"
                          ? "❌ Erro"
                          : "🤖 Assistente"}
                      </span>
                      <span className="text-xs opacity-70">
                        {message.timestamp}
                      </span>
                    </div>

                    {message.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-white/80 text-lg font-bold mt-3 mb-2"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-white/90 text-md font-bold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-white text-sm font-bold mt-2 mb-1"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="mb-2 leading-relaxed text-white/90" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-inside mb-2 space-y-1 text-white/90"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-inside mb-2 space-y-1 text-white/90"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-white-200" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold text-purple-800" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic text-white-200" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  className="bg-purple-400 px-1 py-0.5 rounded text-xs font-mono text-white"
                                  {...props}
                                />
                              ) : (
                                <code
                                  className="block bg-purple-500 p-2 rounded text-xs font-mono text-white overflow-x-auto my-2"
                                  {...props}
                                />
                              ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="bg-black-10 border-l-4 border-purple-400 pl-3 italic text-purple-500 my-2 py-1"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-white-400">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className={`${styles.msg} ${styles.assistant} max-w-[85%] sm:max-w-[75%]`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white-60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white-60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-white-60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <span className="text-purple-600">
                        Assistente está digitando...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Área de Input */}
        <div className="bg-white-100 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta sobre estudos..."
                  rows="2"
                  className={`${styles.textarea} w-full p-3 rounded-lg resize-none text-white placeholder-white text-base`}
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <p className="text-white text-xs mt-2">
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`${styles.sendButton} px-6 py-3 rounded-lg disabled:bg-gray-10 disabled:cursor-not-allowed font-semibold transition-all duration-200 text-base min-w-[80px] flex items-center justify-center`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  "Enviar"
                )}
              </button>
            </div>
          </form>
        </div>

        {error && !loading && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-400 text-white rounded-lg text-sm backdrop-blur-lg">
            <strong>❌ Erro:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}