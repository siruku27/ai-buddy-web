export default function ChatHeader({
    darkMode,
    setDarkMode,
}){
    return (
        <header className={`flex items-center justify-between p-4 border-b ${
            darkMode
                 ? "bg-gray-900 border-gray-700 text-white"
                 : "bg-white border-gray-300 text-black"
         }`}>
            <h1 className="text-2xl font-bold">AI Buddy Pro</h1>
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-xl"
            >
                {darkMode ? "☀️" : "🌙"}
                
            </button>
            <span className="text-sm text-green-600">Online</span>
        </header>
    );
}