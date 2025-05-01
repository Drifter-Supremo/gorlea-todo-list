import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const input = body.prompt?.text || body.input || ''

    // Mock response for AI parsing with intelligent logic
    // In a real implementation, this would call the Gemini API or another AI service
    let title = 'Untitled Task'
    let details = input
    let dueDate = null
    let priority = 'medium'

    // Extract title (first few words or key action)
    const words = input.split(' ')
    if (words.length > 3) {
      title = words.slice(0, 3).join(' ') + '...'
    } else {
      title = input.slice(0, 20) + (input.length > 20 ? '...' : '')
    }

    // Extract due date based on keywords like 'tomorrow', 'today'
    if (input.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      dueDate = tomorrow.toISOString().split('T')[0] + 'T09:00:00'
    } else if (input.toLowerCase().includes('today')) {
      dueDate = new Date().toISOString().split('T')[0] + 'T09:00:00'
    }

    // Extract time if mentioned (e.g., 'at 9am')
    const timeMatch = input.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
    if (timeMatch) {
      let hour = parseInt(timeMatch[1])
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0
      const period = timeMatch[3]?.toLowerCase()
      if (period === 'pm' && hour < 12) hour += 12
      if (period === 'am' && hour === 12) hour = 0
      const date = dueDate ? new Date(dueDate) : new Date()
      date.setHours(hour, minute, 0, 0)
      dueDate = date.toISOString()
    }

    // Determine priority based on keywords
    if (input.toLowerCase().includes('very important') || input.toLowerCase().includes('urgent') || input.toLowerCase().includes('critical')) {
      priority = 'high'
    } else if (input.toLowerCase().includes('not important') || input.toLowerCase().includes('minor')) {
      priority = 'low'
    }

    const parsedTask = {
      title,
      details,
      dueDate,
      priority
    }

    return NextResponse.json(parsedTask)
  } catch (error) {
    console.error('Error parsing task:', error)
    return NextResponse.json({ error: 'Failed to parse task' }, { status: 500 })
  }
}
