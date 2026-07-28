export default function ChatWindow({
  darkMode,
  ChatMessage,
  messages,
  messagesEndRef,
}) {
  return (
    <div
      className={`border rounded-lg p-4 h-80 overflow-y-auto mb-4 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-300"
      }`}
    >
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          darkMode={darkMode}
          role={msg.role}
          content={msg.content}
          loading={msg.loading}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}