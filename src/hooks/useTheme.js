import { useState, useEffect } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem("theme") === "dark";
  });

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
