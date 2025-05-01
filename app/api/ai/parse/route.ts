import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let input = '';
  try {
    const body = await req.json();
    input = body.prompt?.text || body.input || '';

    // Read Gemini API key from environment, checking for NEXT_PUBLIC_ prefix as per user suggestion
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API key', details: 'Checked NEXT_PUBLIC_GEMINI_KEY and GEMINI_API_KEY' }, { status: 500 });
    }

    // Gemini REST API endpoint for content generation
    // Trying a different variation to ensure correctness
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey;

    // System prompt for extracting task fields
    const systemPrompt = `
You are an AI assistant that extracts structured task information from natural language input.
Given a user's input, return a JSON object with the following fields:
- title: a concise title for the task
- details: the full original input or a brief description
- dueDate: an ISO 8601 datetime string if a due date is mentioned, otherwise null
- priority: one of "high", "medium", or "low" based on urgency

Respond ONLY with a valid JSON object, no extra text.
`;

    // Gemini expects a "contents" array with role/content objects
    const payload = {
      contents: [
        { role: "system", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: input }] }
      ]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json({ error: 'Gemini API error', status: response.status, details: errorText, endpoint: endpoint }, { status: 500 });
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    // Gemini's response format: { candidates: [{ content: { parts: [{ text: ... }] } }] }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in Gemini response:', JSON.stringify(data, null, 2));
      return NextResponse.json({ error: 'No response from Gemini', details: JSON.stringify(data, null, 2) }, { status: 500 });
    }

    // Attempt to parse the JSON from Gemini's response
    let parsedTask;
    try {
      parsedTask = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini response:', text, e);
      return NextResponse.json({ error: 'Failed to parse Gemini response', raw: text }, { status: 500 });
    }

    // Defensive: ensure all required fields exist
    const { title, details, dueDate, priority } = parsedTask;
    if (!title || !priority) {
      return NextResponse.json({ error: 'Incomplete task fields', parsedTask }, { status: 500 });
    }

    return NextResponse.json({
      title,
      details,
      dueDate,
      priority
    });
  } catch (error) {
    console.error('Error parsing task:', error);
    return NextResponse.json({ error: 'Failed to parse task', details: error?.toString() }, { status: 500 });
  }
}
