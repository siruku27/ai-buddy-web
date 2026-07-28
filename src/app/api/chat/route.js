import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const message = formData.get("message");
    const image = formData.get("image");

    let stream;

    if (image) {
      // ===== 画像あり =====
      const bytes = await image.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: message || "",
              },
              {
                inlineData: {
                  mimeType: image.type,
                  data: base64,
                },
              },
            ],
          },
        ],
      });
    } else {
      // ===== テキストのみ =====
      stream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: message,
      });
    }

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
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
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