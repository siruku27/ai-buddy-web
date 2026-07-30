"use client";

import { useRef } from "react";
import ImagePreview from "./ImagePreview";
import ImageButton from "./ImageButton";
import SendButton from "./SendButton";
import useChatInput from "../hooks/useChatInput";

export default function ChatInput({
  darkMode,
  message,
  setMessage,
  sendMessage,
  loading,
  image,
  selectImage,
  removeImage,
}) {

  const {
    fileInputRef,
    clearImage,
    handleSend,
    handleKeyDown,
  } = useChatInput({
    image,
    removeImage,
    sendMessage,
  });

  return (
    <>
      <ImageButton
        fileInputRef={fileInputRef}
        selectImage={selectImage}
      />
      <ImagePreview
        image={image}
        removeImage={() => {
        clearImage();
        }}
      />
      <textarea
        className={`w-full rounded-lg p-3 resize-none border ${
          darkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-black border-gray-300"
        }`}
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力... (Enterで送信、Shift + Enterで改行)"
      />
      <SendButton
        loading={loading}
        disabled={
          loading ||
          (!message.trim() && !image)
        }
        onSend={handleSend}
      />
    </>
  );
}