import { useEffect, useRef } from "react";

export default function useLocalStorage(
  key,
  value,
  setValue
) {
  const isLoaded = useRef(false);

  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved) {
      setValue(JSON.parse(saved));
    }

    isLoaded.current = true;
  }, [key, setValue]);

  // 保存(読み込みが終わるまでは書き込まない)
  useEffect(() => {
    if (!isLoaded.current) return;

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);
}
