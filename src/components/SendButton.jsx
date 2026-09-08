export default function SendButton({
  loading,
  disabled,
  onSend,
  onStop,
}) {
  if (loading) {
    return (
      <button
        type="button"
        onClick={onStop}
        className="w-full rounded-lg p-3 text-white bg-red-600 hover:bg-red-700"
      >
        ⏹ 停止
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSend}
      disabled={disabled}
      className={`w-full rounded-lg p-3 text-white bg-blue-600 hover:bg-blue-700
      disabled:bg-gray-400
      disabled:cursor-not-allowed`}
    >
      送信
    </button>
  );
}