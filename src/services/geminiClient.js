import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY が設定されていません。.env.local に GEMINI_API_KEY=あなたのAPIキー を追加してください。"
  );
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const CHAT_MODEL = "gemini-3.6-flash";
