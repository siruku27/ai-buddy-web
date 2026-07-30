import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MEMORY_PROMPT = `
あなたはAIの長期メモリ管理システムです。

ユーザーの発言を見て、
長期的に覚える価値がある情報だけ抽出してください。

保存するもの
・名前
・年齢
・仕事
・スキル
・趣味
・好き嫌い
・目標
・家族構成
・よく使う技術
・住んでいる地域

保存しないもの
・挨拶
・雑談
・質問
・一時的な予定
・今日だけの出来事

JSONだけ返してください。

保存する場合

{
  "save": true,
  "memory": "PHP経験6年"
}

保存しない場合

{
  "save": false
}
`;

export async function checkMemory({
  message,
  history,
  image,
}) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `
${MEMORY_PROMPT}

ユーザー:
${message}
`,
  });

  try {
    return JSON.parse(response.text);
  } catch {
    return {
      save: false,
    };
  }
}