import { GoogleGenAI } from "@google/genai";
import { checkMemory } from "../../../services/memoryService";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const message = formData.get("message") || "";
    const history = JSON.parse(
      formData.get("history") || "[]"
    );
    const memories = JSON.parse(
      formData.get("memories") || "[]"
    );
    const image = formData.get("image");

    const memoryPrompt =
          `
          あなたが覚えているユーザー情報

          ${memories
          .map((m) => "- " + m)
          .join("\n")}

          必要な時だけ自然に利用してください。

          知らないことは推測しないでください。
          `;
    // ===== 会話履歴 =====
    const contents = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: msg.content || "",
        },
      ],
    }));

    contents.unshift({
      role: "user",
      parts: [
        {
          text: memoryPrompt,
        },
      ],
    });

    const memoryPromise = checkMemory({
      message,
      history,
      image: !!image,
    });
    // ===== 最新メッセージ =====
    const userParts = [
      {
        text: message,
      },
    ];

    // ===== 画像がある場合だけ追加 =====
    if (image) {
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      userParts.push({
        inlineData: {
          mimeType: image.type,
          data: base64,
        },
      });
    }

    contents.push({
      role: "user",
      parts: userParts,
    });

    // ===== Geminiへ送信 =====
    const stream = await ai.models.generateContentStream({
      model: "gemini-3.6-flash",
      contents,
    });

    // ===== ストリーミング返信 =====
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(
              encoder.encode(chunk.text ?? "")
            );
          }
        } catch (err) {
          console.error(err);
        } finally {
          try {
            const result = await memoryPromise;
            controller.enqueue(
              encoder.encode(
                "\n__MEMORY__" +
                JSON.stringify(result)
              )
            );
          } catch (err) {
            console.error(err);
          }
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "AIとの通信に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}