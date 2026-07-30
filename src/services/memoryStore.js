import { addMemoryIfNeeded } from "../utils/memoryHelper";

export function saveMemory(memory) {
  if (typeof window === "undefined") return;

  const memories = JSON.parse(
    localStorage.getItem("memories") || "[]"
  );

  const updated = addMemoryIfNeeded(
    memories,
    memory
  );

  localStorage.setItem(
    "memories",
    JSON.stringify(updated)
  );
}

export function getMemories() {
  if (typeof window === "undefined") {
    return [];
  }

  return JSON.parse(
    localStorage.getItem("memories") || "[]"
  );
}

export function clearMemories() {
  localStorage.removeItem("memories");
}