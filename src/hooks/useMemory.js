import { useState, useEffect } from "react";
import { addMemoryIfNeeded } from "../app/utils/memoryHelper";

export default function useMemory() {
  const [memories, setMemories] = useState([]);

  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem("memories");

    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem(
      "memories",
      JSON.stringify(memories)
    );
  }, [memories]);

  // 追加
  function addMemory(content) {
    setMemories((prev) =>
    addMemoryIfNeeded(prev, content)
  );
}

  // 削除
  function removeMemory(index) {
    setMemories((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  // 全削除
  function clearMemory() {
    setMemories([]);
  }

  return {
    memories,
    addMemory,
    removeMemory,
    clearMemory,
  };
}