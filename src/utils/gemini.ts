import { geminiModel, geminiConfig } from "../config/gemini";

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: geminiConfig,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    throw error;
  }
}

export async function generateChatResponse(
  messages: { role: "user" | "model"; content: string }[]
): Promise<string> {
  try {
    const result = await geminiModel.generateContent({
      contents: messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: geminiConfig,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response with Gemini:", error);
    throw error;
  }
} 