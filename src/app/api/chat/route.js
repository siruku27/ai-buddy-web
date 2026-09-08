import { ai, CHAT_MODEL } from "../../../services/geminiClient";
import { checkMemory } from "../../../services/memoryService";
import { isRateLimited, getClientIp } from "../../../utils/rateLimit";

const MAX_MESSAGE_LENGTH = 4000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return Response.json(
        {
          error:
            "リクエストが多すぎます。しばらく待ってから再度お試しください。",
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    const message = (formData.get("message") || "").toString();

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください。`,
        },
        { status: 400 }
      );
    }

    const history = JSON.parse(
      formData.get("history") || "[]"
    );
    const memories = JSON.parse(
      formData.get("memories") || "[]"
    );
    const image = formData.get("image");

    if (image && typeof image === "object" && image.size > 0) {
      if (!image.type?.startsWith("image/")) {
        return Response.json(
          { error: "画像ファイルのみアップロードできます。" },
          { status: 400 }
        );
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return Response.json(
          { error: "画像サイズは5MB以内にしてください。" },
          { status: 400 }
        );
      }
    }

    const memoryPrompt =
          `
          あなたが覚えているユーザー情報

          ${memories
          .map((m) => "- " + m.content)
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

    // 空メッセージ(画像のみの送信)では記憶抽出の意味がないため呼び出しをスキップし、
    // API呼び出し回数とコストを抑える。
    const memoryPromise = message.trim()
      ? checkMemory({ message, history, image: !!image })
      : Promise.resolve({ save: false });
    // ===== 最新メッセージ =====
    const userParts = [
      {
        text: message,
      },
    ];

    // ===== 画像がある場合だけ追加 =====
    if (image && typeof image === "object" && image.size > 0) {
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
      model: CHAT_MODEL,
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
