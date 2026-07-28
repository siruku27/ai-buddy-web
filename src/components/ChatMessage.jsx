import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatMessage({
  darkMode,
  role,
  content,
  loading,
})
{
  const isUser = role === "user";
  const bubbleClass =
  role === "assistant"
    ? darkMode
      ? "bg-gray-700 text-white"
      : "bg-gray-200 text-black"
    : darkMode
      ? "bg-blue-700 text-white"
      : "bg-blue-500 text-white";
  const [copied, setCopied] = useState(false);
  async function copyMessage() {
  await navigator.clipboard.writeText(content);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 1500);
}

  return (
    <div
      className={`mb-4 flex ${
        isUser ? "justify-end" : "justify-start"
      }
      animate-message`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${bubbleClass}`}
      >
        <p className="text-sm font-bold mb-1">
          {isUser ? "あなた" : "AI Buddy"}
        </p>
        {!isUser && (
        <div className="flex justify-end mb-2">
          <button
            onClick={copyMessage}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {copied ? "✅ コピー完了" : "📋 コピー"}
          </button>
        </div>
        )}
        {loading ? (
          <div className="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
          ) : (
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
  style={oneDark}
  language={match[1]}
  PreTag="div"
  wrapLongLines={true}
  customStyle={{
    borderRadius: "10px",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    fontSize: "14px",
    overflowX: "auto",
    maxWidth: "100%",
  }}
  {...props}
>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {content}
</ReactMarkdown>
        )}
      </div>
    </div>
  );
}