import { useRef } from "react";

export default function useChatInput({
  image,
  removeImage,
  sendMessage,
}) {
  const fileInputRef = useRef(null);

  function clearImage() {
    removeImage();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSend() {
    sendMessage(image);
    clearImage();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return {
    fileInputRef,
    clearImage,
    handleSend,
    handleKeyDown,
  };
}