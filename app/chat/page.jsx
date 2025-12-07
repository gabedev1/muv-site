"use client";

import Header from "../components/Header";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages.slice(-10) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro na API");

      let responseText = "";
      if (data.text) responseText = data.text;
      else if (data.candidates?.[0]?.content?.parts?.[0]?.text)
        responseText = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "error", content: `Erro: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <>
      {/* Header fixo com fundo transparente */}
      <Header transparent />

      {/* Container principal com fundo de imagem */}
      <div className="fixed inset-0 -z-10">
        <img
          src="/aluno-rodeado-pela-ia.png"
          alt="Fundo IA e estudante"
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro + gradiente roxo (o que você já tinha no CSS) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/40 to-black/90" />
      </div>

      {/* Conteúdo do chat (por cima do fundo) */}
      <div className="relative flex flex-col min-h-screen pt-20 pb-24 text-gray-100">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-purple-400 mb-4">Assistente de Estudos com IA</h2>
                <p className="text-gray-300 text-lg">Faça uma pergunta sobre qualquer matéria...</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl shadow-2xl flex-shrink-0">
                      A
                    </div>
                  )}

                  <div className={`max-w-3xl ${msg.role === "user" ? "order-1" : ""}`}>
                    <div className={`px-6 py-4 rounded-2xl border ${
                      msg.role === "user"
                        ? "bg-purple-600/90 border-purple-500/50 text-white rounded-tr-none shadow-purple-500/30"
                        : msg.role === "error"
                        ? "bg-red-900/60 border-red-700/50 text-red-200"
                        : "bg-black border-white/10 text-white rounded-tl-none"
                    } shadow-2xl`}>
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-3xl font-bold text-purple-400 mt-8 mb-4 pb-3 border-b border-purple-500/30">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-bold text-purple-300 mt-7 mb-3">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                            p: ({ children }) => <p className="text-gray-100 leading-relaxed mb-4">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc ml-6 mb-5 space-y-2 text-gray-100">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-6 mb-5 space-y-2 text-gray-100">{children}</ol>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 bg-purple-500/20 pl-5 py-3 my-6 italic text-gray-300">{children}</blockquote>,
                            code: ({ inline, className, children }) => {
                              if (inline) return <code className="bg-white/10 px-2 py-1 rounded text-purple-300 text-sm font-mono">{children}</code>;
                              const match = /language-(\w+)/.exec(className || "");
                              const codeString = String(children).replace(/\n$/, "");
                              return (
                                <div className="my-6 -mx-6 rounded-xl overflow-hidden border border-purple-500/30">
                                  <div className="bg-black/80 px-4 py-2 flex justify-between text-xs text-gray-400">
                                    <span>{match?.[1] || "code"}</span>
                                    <button onClick={() => navigator.clipboard.writeText(codeString)} className="hover:text-white flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                      Copiar
                                    </button>
                                  </div>
                                  <SyntaxHighlighter style={vscDarkPlus} language={match?.[1] || "text"} PreTag="div">
                                    {codeString}
                                  </SyntaxHighlighter>
                                </div>
                              );
                            },
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">{children}</a>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      U
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading */}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold text-xl shadow-2xl">
                  A
                </div>
                <div className="bg-black-500 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input fixo no fundo */}
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3 backdrop-blur-2xl bg-black/60 border border-white/20 rounded-2xl p-4 shadow-2xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
              placeholder="Faça uma pergunta sobre estudos..."
              className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 focus:outline-none min-h-14 max-h-48"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${input.trim() && !loading ? "bg-purple-600 hover:bg-purple-700 shadow-lg" : "bg-gray-800 text-gray-500"}`}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Enviar"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">Enter = enviar • Shift + Enter = nova linha</p>
        </div>
      </div>
    </>
  );
}