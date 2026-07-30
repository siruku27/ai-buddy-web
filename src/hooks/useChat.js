import { useState } from "react";
import useStream from "./useStream";
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
  const [loading, setLoading] = useState(false);

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
    const filtered = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(filtered);

    if (
      currentChatId === chatId &&
      filtered.length > 0
    ) {
      setCurrentChatId(filtered[0].id);
    }
  }

  async function sendMessage(image) {
    if (!message.trim() && !image) return;

    const chatId = currentChatId;
    const currentMessage = message;

    const imageUrl = image
      ? URL.createObjectURL(image)
      : null;

    const history =
      currentChat?.messages.slice(-20) || [];

    const memories = getMemories();

    const formData = createFormData(
      currentMessage,
      history,
      image,
      memories
    );

    setChats((prev) =>
      appendUserMessage(
        prev,
        chatId,
        currentMessage,
        imageUrl
      )
    );

    setMessage("");
    setLoading(true);

    try {
      await useStream(
  formData,

  (aiReply) => {
    setChats((prev) =>
      updateAIMessage(
        prev,
        chatId,
        aiReply
      )
    );
  },

  (memory) => {
    if (!memory.save) return;

    saveMemory(memory.memory);

    console.log(
      "Memory Saved:",
      memory.memory
    );
  }
);
    } catch (err) {
      console.error(err);

      setChats((prev) =>
        showError(prev, chatId)
      );
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}