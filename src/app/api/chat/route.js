import { GoogleGenAI } from"@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export async function POST(req) {
    try {
        const { message } = await req.json();
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message,
        });

        return Response.json({ reply: response.text });
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "AIとの通信に失敗しました" },
            { status: 500 }
        );
    }
}