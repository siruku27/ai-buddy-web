export function createFormData(
  message,
  history,
  image,
  memories
) {
  const formData = new FormData();

  formData.append("message", message);

  formData.append(
    "history",
    JSON.stringify(history)
  );

  formData.append(
    "memories",
    JSON.stringify(memories)
  );

  if (image) {
    formData.append("image", image);
  }

  return formData;
}
export function appendUserMessage(
  prevChats,
  chatId,
  currentMessage,
  imageUrl,
  assistantMessageId
) {
  return prevChats.map((chat) => {
    if (chat.id !== chatId) return chat;

    const firstUser =
      chat.messages.filter(
        (m) => m.role === "user"
      ).length === 0;

    return {
      ...chat,
      title: firstUser
        ? (currentMessage || "画像").slice(0, 20)
        : chat.title,
      messages: [
        ...chat.messages,
        {
          role: "user",
          content: currentMessage,
          image: imageUrl,
        },
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          loading: true,
        },
      ],
    };
  });
}
export function updateAIMessage(
  prevChats,
  chatId,
  assistantMessageId,
  aiReply
) {
  return prevChats.map((chat) => {
    if (chat.id !== chatId) return chat;

    const messages = chat.messages.map((message) =>
      message.id === assistantMessageId && message.role === "assistant"
        ? { ...message, content: aiReply, loading: false }
        : message
    );

    return {
      ...chat,
      messages,
    };
  });
}
export function showError(
  prevChats,
  chatId,
  assistantMessageId,
  message = "エラーが発生しました。"
) {
  return updateAIMessage(prevChats, chatId, assistantMessageId, message);
}
