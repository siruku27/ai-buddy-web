import { useState } from "react";

export default function useImageUpload() {
  const [image, setImage] = useState(null);

  function selectImage(file) {
    if (!file) return;

    setImage(file);
  }

  function removeImage() {
    setImage(null);
  }

  return {
    image,
    setImage,
    selectImage,
    removeImage,
  };
}