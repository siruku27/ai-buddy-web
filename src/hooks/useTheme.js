import { useState, useEffect } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(false);

  // 起動時にテーマを読み込む
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // テーマ変更時に保存
  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return {
    darkMode,
    setDarkMode,
  };
}