import { useEffect } from "react";

export default function useLocalStorage(
  key,
  value,
  setValue
) {
  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved) {
      setValue(JSON.parse(saved));
    }
  }, [key, setValue]);

  // 保存
  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);
}