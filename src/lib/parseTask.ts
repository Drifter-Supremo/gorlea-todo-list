export interface ParsedTask {
  title: string
  details?: string
  dueDate?: string | null
  priority?: string
}

export async function parseTask(input: string): Promise<ParsedTask> {
  // Mock API call to /api/ai/parse
  const res = await fetch("/api/ai/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input })
  })
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`)
  }
  const json: ParsedTask = await res.json()
  return json
}
