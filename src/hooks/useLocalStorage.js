import { useEffect, useState } from "react";

export default function useLocalStorage(
  key,
  value,
  setValue
) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 読み込み
  useEffect(() => {
    const saved = localStorage.getItem(key);

    if (saved) {
      setValue(JSON.parse(saved));
    }

    // SSR後に保存データと完了状態を同じ更新で反映し、初期値の保存を防ぐ。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, [key, setValue]);

  // 保存(読み込みが終わるまでは書き込まない)
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value, isLoaded]);

  return isLoaded;
}
