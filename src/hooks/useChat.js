import { useRef, useState } from "react";
import streamChat from "./streamChat";
import useLocalStorage from "./useLocalStorage";
import {
  saveMemory,
  getMemories,
} from "../services/memoryStore";
import {
  createFormData,
  appendUserMessage,
  updateAIMessage,
  showError,
} from "../utils/chatHelpers";

export default function useChat(message, setMessage) {
  const [chats, setChats] = useState([]);

  const [selectedChatId, setCurrentChatId] = useState(1);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const isLoaded = useLocalStorage("chats", chats, setChats);

  const currentChat = chats.find(
    (chat) => chat.id === selectedChatId
  ) || chats[0];
  const currentChatId = currentChat?.id ?? null;
  const canSend = isLoaded && !!currentChat;

  function createNewChat() {
    if (!isLoaded) return;
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
    if (!isLoaded) return;
    const chatToDelete = chats.find(
      (chat) => chat.id === chatId
    );

    chatToDelete?.messages.forEach((msg) => {
      if (msg.image) URL.revokeObjectURL(msg.image);
    });

    const filtered = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(filtered);

    if (currentChatId === chatId) {
      setCurrentChatId(filtered[0]?.id ?? null);
    }
  }

  function stopGenerating() {
    abortControllerRef.current?.abort();
  }

  async function sendMessage(image, onAccepted) {
    if (!canSend || abortControllerRef.current) return;
    if (!message.trim() && !image) return;

    const chatId = currentChatId;
    const currentMessage = message;
    const assistantMessageId = crypto.randomUUID();
    const controller = new AbortController();
    // stateの再描画を待たずに、同じイベント内の連続送信も防ぐ。
    abortControllerRef.current = controller;

    try {
      const history = currentChat.messages.slice(-20);
      const memories = getMemories();
      const formData = createFormData(
        currentMessage,
        history,
        image,
        memories
      );
      const imageUrl = image ? URL.createObjectURL(image) : null;

      setChats((prev) =>
        appendUserMessage(
          prev,
          chatId,
          currentMessage,
          imageUrl,
          assistantMessageId
        )
      );
      setMessage("");
      setLoading(true);
      onAccepted?.();

      await streamChat(
        formData,

        (aiReply) => {
          if (abortControllerRef.current !== controller || controller.signal.aborted) return;
          setChats((prev) =>
            updateAIMessage(
              prev,
              chatId,
              assistantMessageId,
              aiReply
            )
          );
        },

        (memory) => {
          if (abortControllerRef.current !== controller || controller.signal.aborted) return;
          if (!memory.save) return;

          saveMemory(memory.memory);

          console.log(
            "Memory Saved:",
            memory.memory
          );
        },

        controller.signal
      );
    } catch (err) {
      if (abortControllerRef.current !== controller) return;
      if (err.name === "AbortError") {
        setChats((prev) =>
          showError(prev, chatId, assistantMessageId, "送信を中止しました。")
        );
      } else {
        console.error(err);

        setChats((prev) =>
          showError(prev, chatId, assistantMessageId, err.message)
        );
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }

  return {
    chats,
    setChats,
    currentChat,
    currentChatId,
    setCurrentChatId,
    loading,
    canSend,
    createNewChat,
    deleteChat,
    sendMessage,
    stopGenerating,
  };
}
