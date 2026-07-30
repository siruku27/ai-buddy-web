export default function ImagePreview({
  image,
  removeImage,
}) {
  if (!image) return null;

  return (
    <div className="mb-3 relative inline-block">
      <img
        src={URL.createObjectURL(image)}
        alt="preview"
        className="w-40 rounded-lg border"
      />
      <button
        onClick={removeImage}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white"
      >
        ×
      </button>

      <p className="text-sm mt-1">
        📎 {image.name}
      </p>
    </div>
  );
}