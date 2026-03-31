import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTradingAdvice(marketContext: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Holly AI, an advanced trading assistant for the Flashlons platform. 
      Analyze the following market context and provide a concise, high-probability trading insight.
      Context: ${marketContext}
      Format: Short paragraph with clear action (Buy/Sell/Hold) and reasoning.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI insights at this time.";
  }
}

export async function generateStrategy(description: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a trading strategy JSON based on this description: "${description}".
        The JSON should include: name, indicators (array), entryConditions (array), exitConditions (array), and riskRules (object).
        Return ONLY the JSON string.`,
        config: {
            responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Gemini API Error:", error);
      return { error: "Failed to generate strategy" };
    }
}

export async function explainTrade(tradeData: any) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explain the reasoning behind this trade execution on the Flashlons platform.
        Trade: ${JSON.stringify(tradeData)}
        Provide a concise explanation of why the AI bot entered/exited this position based on market conditions and pattern recognition.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI reasoning unavailable.";
    }
}
