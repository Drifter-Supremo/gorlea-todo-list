import OpenAI from "openai";
import { ParsedTask } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseTask(raw: string): Promise<ParsedTask> {
  try {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI that extracts structured task information from natural language input. Given a user's input, return a JSON object with the following fields:
- title: a concise title for the task
- details: the full original input or a brief description
- dueDate: an ISO 8601 datetime string if a due date is mentioned, otherwise null
- priority: one of "high", "medium", or "low" based on urgency

Respond ONLY with a valid JSON object, no extra text.`
        },
        {
          role: "user",
          content: `Extract task information from: "${raw}"`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const outputText = res.choices[0].message.content;
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
