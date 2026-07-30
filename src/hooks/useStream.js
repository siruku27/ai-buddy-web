export default async function useStream(
  formData,
  onChunk,
  onMemory
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  if (!res.body) {
    throw new Error("レスポンスがありません");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let aiReply = "";

  while (true) {
    const { done, value } =
      await reader.read();

    if (done) break;

    const text = decoder.decode(value, {
      stream: true,
    });

    if (text.includes("__MEMORY__")) {
      const parts =
        text.split("__MEMORY__");

      aiReply += parts[0];

      onChunk(aiReply);

      if (parts[1]) {
        try {
          const memory = JSON.parse(parts[1]);

          onMemory?.(memory);

        } catch (err) {
          console.error(
            "Memory Parse Error",
            err
          );
        }
      }

    } else {

      aiReply += text;

      onChunk(aiReply);

    }
  }

  return aiReply;
}