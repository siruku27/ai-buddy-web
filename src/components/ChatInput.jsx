export default function ChatInput({ darkMode, message, setMessage, sendMessage }) {
    return (
        <textarea
          className={`w-full rounded-lg p-3 resize-none border ${
            darkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="メッセージを入力...　(Enterで送信、Shift + Enterで改行)"
        />
    );
}