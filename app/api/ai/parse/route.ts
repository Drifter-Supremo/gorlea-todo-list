import { NextResponse } from 'next/server'
import { parseTask, resolveDate } from '@lib/parseTask'
import { addTask } from '@lib/firestore'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = body.prompt?.text || body.input || '';
    
    if (!input) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const parsedTask = await parseTask(input);
    const dueTimestamp = parsedTask.datePhrase ? resolveDate(parsedTask.datePhrase) : resolveDate('');
    const taskData = {
      title: parsedTask.title,
      details: parsedTask.details,
      priority: (parsedTask.priority as 'low' | 'medium' | 'high') || 'medium',
      dueDate: new Date(dueTimestamp),
      userId: body.userId || "mock-user-id" // Mock userId for now, should be passed in request body
    };
    
    await addTask(taskData);
    return NextResponse.json({ success: true, title: parsedTask.title });
  } catch (error) {
    console.error('Error parsing task:', error);
    return NextResponse.json({ error: 'Failed to parse task', details: error?.toString() }, { status: 500 });
  }
}
