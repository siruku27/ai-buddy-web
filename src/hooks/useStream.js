export default async function useStream(
  formData,
  onChunk
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

    aiReply += decoder.decode(value, {
      stream: true,
    });

    onChunk(aiReply);
  }

  return aiReply;
}