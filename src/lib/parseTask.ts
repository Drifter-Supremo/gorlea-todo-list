import OpenAI from "openai";
import { ParsedTask } from "./types";
import * as chrono from "chrono-node";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseTask(raw: string): Promise<ParsedTask> {
  try {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Gorlea, an energetic AI task assistant. When rewriting user input into a task, choose a clear, concise title, and a friendly, engaging detail description. Choose a relevant priority level. Feel free to rephrase creatively to make tasks more human-readable.
Your job is to read the user's input and rewrite it into:
  • A concise, punchy "title" (you may rephrase creatively)
  • A "details" sentence or two that captures context
  • A "priority" value of low/medium/high
  • The raw "datePhrase" exactly as the user wrote it (e.g. "tomorrow at 9am")
Return strictly valid JSON only, nothing else.`
        },
        {
          role: "user",
          content: `Extract task information from: "${raw}"`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const outputText: string | null = res.choices[0].message.content;
    if (!outputText) {
      throw new Error("No response content from OpenAI");
    }
    
    const json = JSON.parse(outputText);
    return json;
  } catch (error) {
    console.error("Error parsing task with OpenAI:", error);
    throw new Error(`Failed to parse task: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function resolveDate(phrase: string): string {
  let parsedDate: Date | null = null;
  
  try {
    // Normalize phrase for case-insensitive matching
    const normalizedPhrase = phrase.toLowerCase();
    // Parse the date phrase using chrono-node with forwardDates option
    parsedDate = chrono.parseDate(phrase, new Date(), { forwardDate: true });
    
    // If parsing succeeds, apply overrides and return ISO string
    if (parsedDate) {
      // Check for time overrides based on keywords
      if (normalizedPhrase.includes("morning")) {
        parsedDate.setHours(9, 0, 0, 0);
      } else if (normalizedPhrase.includes("afternoon")) {
        parsedDate.setHours(12, 0, 0, 0);
      } else if (normalizedPhrase.includes("night") || normalizedPhrase.includes("evening")) {
        parsedDate.setHours(20, 0, 0, 0);
      }
      return parsedDate.toISOString();
    }
  } catch (error) {
    console.warn("Chrono parsing failed:", error);
  }
  
  // Fallback to today at 9am if parsing fails
  const today = new Date();
  today.setHours(9, 0, 0, 0);
  return today.toISOString();
}
