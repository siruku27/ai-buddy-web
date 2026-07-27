export default function Sidebar() {
  return (
    <aside className="w-72 bg-gray-900 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">
        🤖 AI Buddy
      </h2>

      <button
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

      <div className="space-y-2">
        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-800">
          Reactについて
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-800">
          JavaScript
        </button>

        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-800">
          AI副業
        </button>
      </div>
    </aside>
  );
}