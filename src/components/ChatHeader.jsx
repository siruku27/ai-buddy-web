export default function ChatHeader({
    darkMode,
    setDarkMode,
    onExport,
    onOpenMemory,
}){
    return (
        <header className={`flex items-center justify-between p-4 border-b ${
            darkMode
                 ? "bg-gray-900 border-gray-700 text-white"
                 : "bg-white border-gray-300 text-black"
         }`}>
            <h1 className="text-2xl font-bold">AI Buddy Pro</h1>
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenMemory}
                    className="text-xl"
                    title="記憶を管理"
                >
                    🧠
                </button>
                <button
                    onClick={onExport}
                    className="text-xl"
                    title="このチャットをエクスポート"
                >
                    ⬇️
                </button>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-xl"
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>
                <span className="text-sm text-green-600">Online</span>
            </div>
        </header>
    );
}
