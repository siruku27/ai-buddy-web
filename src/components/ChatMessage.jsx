export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`mb-4 flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        <p className="text-sm font-bold mb-1">
          {isUser ? "あなた" : "AI Buddy"}
        </p>

        <p>{content}</p>
      </div>
    </div>
  );
}