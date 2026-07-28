"use client";

import { useEffect, useState } from "react";

export default function TypingMessage({ text }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}