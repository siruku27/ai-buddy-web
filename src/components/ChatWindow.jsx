export default function ChatWindow({ darkMode, ChatMessage, messages, setMessages, messagesEndRef }) {
    return (
        <>
            <button
              onClick={() => {
                const initialMessages = [
                  {
                    role: "assistant",
                    content: "こんにちは！何でも聞いてください😊",
                  },
                ];
                setMessages(initialMessages);

                localStorage.removeItem("messages");
              }}
              className="mb-4 rounded-lg bg-red-500 px-4 py-2 text-white">
                新しいチャット
            </button>
            <div className={`border rounded-lg p-4 h-80 overflow-y-auto mb-4 ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-300"
             }`}>
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
        </>
    );
}