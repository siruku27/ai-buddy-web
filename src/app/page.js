"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply("エラーが発生しました。");
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
          <p className="font-bold text-blue-600">AI</p>
          <p>{reply || "こんにちは！何でも聞いてください😊"}</p>
        </div>

        <input
          className="w-full border rounded-lg p-3 mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="質問を入力..."
        />

        <button
          onClick={sendMessage}
          className="w-full bg-blue-500 text-white rounded-lg p-3"
        >
          {loading ? "考え中..." : "送信"}
        </button>

      </div>
    </main>
  );
}