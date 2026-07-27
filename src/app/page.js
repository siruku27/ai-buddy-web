"use client";
import ChatMessage from "../components/ChatMessage";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "こんにちは！何でも聞いてください😊",
    }
  ]);

  // 起動時に読み込む
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDarkMode(true);
    }
  }, []);

// テーマ変更時に保存
  useEffect(() => {
   localStorage.setItem(
    "theme",
    darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("messages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "messages",
      JSON.stringify(messages)
    );
  }, [messages]);

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
    <main
      className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
        }`}
    >
      <div className={`w-full max-w-2xl rounded-xl shadow-lg p-6 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-black"
        }`}>
        <ChatHeader
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <ChatWindow
          darkMode={darkMode}
          ChatMessage={ChatMessage}
          messages={messages}
          setMessages={setMessages}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput
          darkMode={darkMode}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          className={`w-full rounded-lg p-3 text-white ${
            loading
              ? "bg-gray-500"
              : "bg-blue-600 hover:bg-blue-700"
            }
          disabled:bg-gray-400
          disabled:cursor-not-allowed
          `}
        >
         {loading ? "考え中..." : "送信"}
        </button>
      </div>
    </main>
  );
}