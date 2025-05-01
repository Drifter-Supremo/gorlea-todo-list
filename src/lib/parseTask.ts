export interface ParsedTask {
  title: string
  details?: string
  dueDate?: string | null
  priority?: string
}

export async function parseTask(input: string): Promise<ParsedTask> {
  // your Gemini/OpenAI call here
  // for now, assume it returns JSON.string of ParsedTask
  const res = await fetch("/api/ai/parse", { /* … */ })
  const json: ParsedTask = await res.json()
  return json
}
