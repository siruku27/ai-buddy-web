export default function Sidebar({
  chats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
  deleteChat,
}) {
  return (
    <aside className="w-72 bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">
        🤖 AI Buddy
      </h2>

      {/* 新しいチャット */}
      <button
        onClick={createNewChat}
        className="
          mb-6
          rounded-lg
          bg-blue-600
          p-3
          hover:bg-blue-700
          transition
        "
      >
        ＋ 新しいチャット
      </button>

      {/* チャット一覧 */}
      <div className="space-y-2">
        {chats.map((chat) => (
  <div
    key={chat.id}
    className="flex items-center gap-2"
  >
    <button
      onClick={() => setCurrentChatId(chat.id)}
      className={`flex-1 rounded-lg p-3 text-left transition ${
        currentChatId === chat.id
          ? "bg-blue-600"
          : "hover:bg-gray-800"
      }`}
    >
      {chat.title}
    </button>

    <button
      onClick={() => deleteChat(chat.id)}
      className="rounded p-2 hover:bg-red-600"
    >
      🗑️
    </button>
  </div>
))}
      </div>
    </aside>
  );
}