import { useEffect } from "react";

export default function useAutoScroll(
  messagesEndRef,
  messages
) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
}