export default function ImageButton({
  fileInputRef,
  selectImage,
}) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          selectImage(e.target.files[0])
        }
      />
      <button
        type="button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        className="rounded-lg px-4 py-2 border hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        📷 画像
      </button>
    </>
  );
}