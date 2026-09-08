export function exportChatAsMarkdown(chat) {
  if (!chat) return;

  const lines = chat.messages.map((msg) => {
    const speaker = msg.role === "user" ? "あなた" : "AI Buddy";
    return `**${speaker}:**\n\n${msg.content}\n`;
  });

  const markdown = `# ${chat.title}\n\n${lines.join("\n---\n\n")}`;

  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${chat.title || "chat"}.md`;
  link.click();

  URL.revokeObjectURL(url);
}
