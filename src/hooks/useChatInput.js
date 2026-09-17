import { useRef } from "react";

export default function useChatInput({
  image,
  removeImage,
  sendMessage,
  loading,
  canSend,
}) {
  const fileInputRef = useRef(null);
  const isComposingRef = useRef(false);

  function clearImage() {
    removeImage();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSend() {
    if (loading || !canSend || isComposingRef.current) return;
    // 同期的な送信ロックで受理された場合だけ添付画像をクリアする。
    sendMessage(image, clearImage);
  }

  function handleCompositionStart() {
    isComposingRef.current = true;
  }

  function handleCompositionEnd() {
    isComposingRef.current = false;
  }

  function handleKeyDown(e) {
    if (
      isComposingRef.current ||
      e.nativeEvent.isComposing ||
      e.nativeEvent.keyCode === 229
    ) return;

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
    handleCompositionStart,
    handleCompositionEnd,
  };
}
