export function createFormData(
  message,
  history,
  image
) {
  const formData = new FormData();

  formData.append("message", message);

  formData.append(
    "history",
    JSON.stringify(history)
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
  imageUrl
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
  aiReply
) {
  return prevChats.map((chat) => {
    if (chat.id !== chatId) return chat;

    const messages = [...chat.messages];

    messages[messages.length - 1] = {
      role: "assistant",
      content: aiReply,
      loading: false,
    };

    return {
      ...chat,
      messages,
    };
  });
}
export function showError(
  prevChats,
  chatId
) {
  return prevChats.map((chat) => {
    if (chat.id !== chatId) return chat;

    const messages = [...chat.messages];

    messages[messages.length - 1] = {
      role: "assistant",
      content: "エラーが発生しました。",
      loading: false,
    };

    return {
      ...chat,
      messages,
    };
  });
}