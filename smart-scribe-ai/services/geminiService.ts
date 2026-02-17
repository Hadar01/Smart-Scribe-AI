import { GoogleGenAI } from "@google/genai";
import { ToneType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

// Advanced System Instruction for Hinglish and Context preservation
const SYSTEM_INSTRUCTION = `You are an advanced AI writing assistant designed for keyboard integration.
Your unique capability is native understanding of "Hinglish" (Hindi + English mixed).

CORE RULES (STRICTLY FOLLOW):
1. **NO TRANSLATION**: If the user writes in Hinglish, DO NOT translate it to English. Keep the Hindi words intact.
   - Bad: Input: "Mai market ja raha hu" -> Output: "I am going to the market."
   - Good: Input: "Mai market ja raha hu" -> Output: "Mai market ja raha hu." (Correcting only spelling/grammar if needed).
   
2. **PRESERVE CONTEXT**: Do not change the meaning, proper nouns, or specific terminology used by the user.

3. **GRAMMAR CORRECTION**: 
   - If English: Fix English grammar/spelling.
   - If Hinglish: Fix the spelling of Hindi words (using standard Latin script spellings) and ensure the sentence structure flows naturally for a Hinglish speaker.

4. **TONE ADJUSTMENT**:
   - Apply the requested tone (Professional, Casual, etc.) to the *existing language*.
   - If input is Hinglish, the output should be Professional Hinglish (e.g., using "aap" instead of "tu", adding "ji", removing slang) rather than switching to English.

5. **OUTPUT**: Return ONLY the transformed text string. No quotes, no markdown, no explanations.
`;

export const generateRewrite = async (
  text: string, 
  tone: ToneType
): Promise<string> => {
  if (!text.trim()) return "";

  let prompt = "";

  // Specific prompts tailored for Hinglish context retention
  switch (tone) {
    case ToneType.GRAMMAR:
      prompt = `Correct the grammar and spelling. If the text is Hinglish, KEEP IT HINGLISH. Fix only mistakes. Preserve the original context: "${text}"`;
      break;
    case ToneType.PROFESSIONAL:
      prompt = `Make this text sound professional and formal. If it is Hinglish, use respectful words (like 'Kripya', 'Ji', 'Aap'). Do not translate to English unless the original was English: "${text}"`;
      break;
    case ToneType.CASUAL:
      prompt = `Make this text sound casual and friendly. If Hinglish, use natural conversational words (like 'yaar', 'bro'). Keep it short: "${text}"`;
      break;
    case ToneType.SOCIAL:
      prompt = `Draft this for social media. Make it engaging. If Hinglish, keep the desi vibe. Add 1-2 emojis. Context: "${text}"`;
      break;
    case ToneType.POLITE:
      prompt = `Make this extremely polite and humble. If Hinglish, use soft language. Context: "${text}"`;
      break;
    case ToneType.WITTY:
      prompt = `Add a witty or clever twist to this. Keep the language style (English or Hinglish) same as input: "${text}"`;
      break;
    case ToneType.EMOJIFY:
      prompt = `Add relevant emojis to this text without removing the words. Enhance the emotion: "${text}"`;
      break;
    default:
      return text;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, // Lower temperature for more consistent grammar corrections
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI Agent is offline. Please check connection.");
  }
};
