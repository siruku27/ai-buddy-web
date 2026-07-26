"use client";
import ChatMessage from "../components/ChatMessage";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "こんにちは！何でも聞いてください😊",
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
  if (!message.trim()) return;

  // ユーザーのメッセージを追加
  const currentMessage = message;
  const userMessage = {
    role: "user",
    content: currentMessage,
  };

  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentMessage,
      }),
    });

    const data = await res.json();

     // AIの返事を追加
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);

    setMessage("");
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "エラーが発生しました。",
      },
    ]);
  }

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🤖 AI Buddy
        </h1>

        <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              role={msg.role}
              content={msg.content}
            />
          ))}
        </div>

        <textarea
          className="w-full border rounded-lg p-3 mb-3 resize-none"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="メッセージを入力...　(Enterで送信、Shift + Enterで改行)"
        />

        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className="w-full bg-blue-500 text-white rounded-lg p-3
                     disabled:bg-gray-400
                     disabled:cursor-not-allowed"
        >
          {loading ? "考え中..." : "送信"}
        </button>

      </div>
    </main>
  );
}