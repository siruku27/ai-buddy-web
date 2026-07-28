"use client";

import { useState, useRef } from "react";

export default function ChatInput({
  darkMode,
  message,
  setMessage,
  sendMessage,
  loading,
}) {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-2"
      />

      {image && (
  <div className="mb-2">
    <img
      src={URL.createObjectURL(image)}
      alt="preview"
      className="w-40 rounded-lg"
    />

    <p className="text-sm mt-1">
      📎 {image.name}
    </p>
  </div>
)}

      <textarea
        className={`w-full rounded-lg p-3 resize-none border ${
          darkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-black border-gray-300"
        }`}
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(image);
            setImage(null);
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
}
          }
        }}
        placeholder="メッセージを入力... (Enterで送信、Shift + Enterで改行)"
      />
      <button
            onClick={() => {
              sendMessage(image);
              setImage(null);
          }}
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
    </>
  );
}