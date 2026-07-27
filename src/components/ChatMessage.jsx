export default function ChatMessage({ darkMode, role, content }) {
  const isUser = role === "user";
  const bubbleClass =
  role === "assistant"
    ? darkMode
      ? "bg-gray-700 text-white"
      : "bg-gray-200 text-black"
    : darkMode
      ? "bg-blue-700 text-white"
      : "bg-blue-500 text-white";

  return (
    <div
      className={`mb-4 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${bubbleClass}`}
      >
        <p className="text-sm font-bold mb-1">
          {isUser ? "あなた" : "AI Buddy"}
        </p>

        <p>{content}</p>
      </div>
    </div>
  );
}