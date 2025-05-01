import { NextResponse } from 'next/server'
import { parseTask } from '@lib/parseTask'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.prompt?.text || body.input || '';
    
    if (!input) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const parsedTask = await parseTask(input);
    return NextResponse.json(parsedTask);
  } catch (error) {
    console.error('Error parsing task:', error);
    return NextResponse.json({ error: 'Failed to parse task', details: error?.toString() }, { status: 500 });
  }
}
