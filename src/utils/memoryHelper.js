export function isDuplicateMemory(
  memories,
  content
) {
  return memories.some(
    (memory) =>
      memory.content.trim().toLowerCase() ===
      content.trim().toLowerCase()
  );
}

export function addMemoryIfNeeded(
  memories,
  content
) {
  if (isDuplicateMemory(memories, content)) {
    return memories;
  }

  return [
    ...memories,
    {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
    },
  ];
}