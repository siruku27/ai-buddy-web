"use client";

import { useState } from "react";
import {
  getMemories,
  removeMemory,
  clearMemories,
} from "../services/memoryStore";

export default function MemoryPanel({
  darkMode,
  onClose,
}) {
  const [memories, setMemories] = useState(() => getMemories());

  function handleRemove(id) {
    removeMemory(id);
    setMemories(getMemories());
  }

  function handleClearAll() {
    clearMemories();
    setMemories([]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full max-w-md rounded-xl p-6 shadow-lg ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">🧠 記憶の管理</h2>
          <button
            onClick={onClose}
            className="text-xl leading-none"
          >
            ×
          </button>
        </div>

        {memories.length === 0 ? (
          <p className="text-sm opacity-70">
            保存されている記憶はありません。
          </p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto mb-4">
            {memories.map((memory) => (
              <li
                key={memory.id}
                className={`flex items-start justify-between gap-2 rounded-lg p-3 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <span className="text-sm">{memory.content}</span>
                <button
                  onClick={() => handleRemove(memory.id)}
                  className="text-red-500 hover:text-red-700 shrink-0"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}

        {memories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="w-full rounded-lg p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            すべての記憶を削除
          </button>
        )}
      </div>
    </div>
  );
}
