"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
  {
    id: 1,
    title: "React",
    messages: [],
  },
  {
    id: 2,
    title: "JavaScript",
    messages: [],
  },
  {
    id: 3,
    title: "AI副業",
    messages: [],
  },
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);
  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

function createNewChat() {
  const newChat = {
    id: Date.now(),
    title: "新しいチャット",
    messages: [
      {
        role: "assistant",
        content: "こんにちは！何でも聞いてください😊",
      },
    ],
  };

  setChats((prev) => [...prev, newChat]);
  setCurrentChatId(newChat.id);
}

function deleteChat(chatId) {
  const filteredChats = chats.filter(
    (chat) => chat.id !== chatId
  );

  setChats(filteredChats);

  if (
    currentChatId === chatId &&
    filteredChats.length > 0
  ) {
    setCurrentChatId(filteredChats[0].id);
  }
}

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
  }, [currentChat?.messages]);

  useEffect(() => {
    const saved = localStorage.getItem("chats");
    if (saved) {
      setChats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  const [loading, setLoading] = useState(false);

async function sendMessage() {
  if (!message.trim()) return;

  const currentMessage = message;

  const userMessage = {
    role: "user",
    content: currentMessage,
  };

  const loadingMessage = {
    role: "assistant",
    content: "考えています...",
    loading: true,
  };

  // ユーザーと「考えています...」を追加
  setChats((prevChats) =>
  prevChats.map((chat) => {
    if (chat.id !== currentChatId) return chat;

    const isFirstUserMessage =
      chat.messages.filter(msg => msg.role === "user").length === 0;

    return {
      ...chat,
      title: isFirstUserMessage
        ? currentMessage.slice(0, 20)
        : chat.title,
      messages: [
        ...chat.messages,
        userMessage,
        loadingMessage,
      ],
    };
  })
);

  setMessage("");
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

    // 最後の「考えています...」をAIの返答に置き換える
    setChats((prevChats) =>
  prevChats.map((chat) => {
    if (chat.id !== currentChatId) return chat;

    const newMessages = [...chat.messages];

    newMessages[newMessages.length - 1] = {
      role: "assistant",
      content: data.reply,
    };

    return {
      ...chat,
      messages: newMessages,
    };
  })
);
  } catch (error) {
    console.error(error);

    setChats((prevChats) =>
  prevChats.map((chat) => {
    if (chat.id !== currentChatId) return chat;

    const newMessages = [...chat.messages];

    newMessages[newMessages.length - 1] = {
      role: "assistant",
      content: "エラーが発生しました。",
    };

    return {
      ...chat,
      messages: newMessages,
    };
  })
);
  }
  setLoading(false);
}
  return (
    <main
      className={`min-h-screen flex ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
        }`}
    >
      <Sidebar
         chats={chats}
  currentChatId={currentChatId}
  setCurrentChatId={setCurrentChatId}
  createNewChat={createNewChat}
  deleteChat={deleteChat}
      />
        <div
          className={`flex-1 flex justify-center items-center`}
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
            messages={currentChat?.messages || []}
            setChats={setChats}
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
      </div>
    </main>
  );
}