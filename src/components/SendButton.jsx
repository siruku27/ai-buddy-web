export default function SendButton({
  loading,
  disabled,
  onSend,
}) {
  return (
    <button
      type="button"
      onClick={onSend}
      disabled={disabled}
      className={`w-full rounded-lg p-3 text-white ${
        loading
          ? "bg-gray-500"
          : "bg-blue-600 hover:bg-blue-700"
      }
      disabled:bg-gray-400
      disabled:cursor-not-allowed`}
    >
      {loading ? "考え中..." : "送信"}
    </button>
  );
}