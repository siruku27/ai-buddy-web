"use client";

import ImagePreview from "./ImagePreview";
import ImageButton from "./ImageButton";
import SendButton from "./SendButton";
import useChatInput from "../hooks/useChatInput";

export default function ChatInput({
  darkMode,
  message,
  setMessage,
  sendMessage,
  stopGenerating,
  loading,
  canSend,
  image,
  selectImage,
  removeImage,
}) {

  const {
    fileInputRef,
    clearImage,
    handleSend,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useChatInput({
    image,
    removeImage,
    sendMessage,
    loading,
    canSend,
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
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        disabled={!canSend}
        placeholder={canSend
          ? "メッセージを入力... (Enterで送信、Shift + Enterで改行)"
          : "新しいチャットを作成してください"}
      />
      <SendButton
        loading={loading}
        disabled={
          loading ||
          !canSend ||
          (!message.trim() && !image)
        }
        onSend={handleSend}
        onStop={stopGenerating}
      />
    </>
  );
}
