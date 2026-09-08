"use client";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import ChatHeader from "../components/ChatHeader";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import Sidebar from "../components/Sidebar";
import MemoryPanel from "../components/MemoryPanel";
import useChat from "../hooks/useChat";
import useLocalStorage from "../hooks/useLocalStorage";
import useTheme from "../hooks/useTheme";
import useAutoScroll from "../hooks/useAutoScroll";
import useImageUpload from "../hooks/useImageUpload";
import { exportChatAsMarkdown } from "../utils/exportChat";

export default function Home() {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const {darkMode, setDarkMode,} = useTheme();
  const {
    image,
    selectImage,
    removeImage,
  } = useImageUpload();
  const {
    chats,
    setChats,
    currentChat,
    currentChatId,
    setCurrentChatId,

    loading,
    setLoading,

    createNewChat,
    deleteChat,
    sendMessage,
    stopGenerating,
  } = useChat(message, setMessage);

  useLocalStorage(
    "chats",
    chats,
    setChats
  );

  useAutoScroll(
    messagesEndRef,
    currentChat?.messages
  );

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
            onExport={() => exportChatAsMarkdown(currentChat)}
            onOpenMemory={() => setShowMemoryPanel(true)}
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
            stopGenerating={stopGenerating}
            loading={loading}
            image={image}
            selectImage={selectImage}
            removeImage={removeImage}
          />
        </div>
      </div>

      {showMemoryPanel && (
        <MemoryPanel
          darkMode={darkMode}
          onClose={() => setShowMemoryPanel(false)}
        />
      )}
    </main>
  );
}
