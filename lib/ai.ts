import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. อ่าน API Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

// 2. สร้าง instance ของ AI
const genAI = new GoogleGenerativeAI(apiKey);

// 3. เลือกโมเดล (gemini-1.5-flash คือตัวเร็วและถูกสุด เหมาะกับงานเรา)
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 4. ฟังก์ชันสำหรับถามคำศัพท์ (Helper Function)
export async function generateVocabData(word: string) {
  const prompt = `
    Act as a dictionary API. 
    Define the word "${word}" for a vocabulary learning app.
    
    Return ONLY a JSON object with this format (no markdown, no backticks):
    {
      "definition": "Definition in Thai (short and clear)",
      "category": "One of: General, Noun, Verb, Adjective, Mindset, Tech, Soft Skill",
      "example": "A simple example sentence in English"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // ทำความสะอาด JSON (เผื่อ AI เผลอใส่ ```json ... ``` มา)
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
}