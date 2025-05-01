# Gorlea Tasks

A minimal task management web application with an AI assistant built using Next.js, React, Tailwind CSS, and shadcn/ui.

![Gorlea Tasks](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gorlea-logo-pRLW6ezEqdZlsBjxIPIRKmG3oKrXUK.png)

## Features

- **Task Management**
  - Create, view, and complete tasks
  - Set due dates and priority levels
  - Add details to tasks (with "Details" field, not "Description")
  - Organize tasks into "To Do" and "Completed" sections
  
- **AI Assistant**
  - Chat with Gorlea AI about your tasks and ideas
  - Get suggestions and assistance with task management
  - Interactive chat interface
  
- **User Interface**
  - Clean, minimal design with custom color scheme
  - Responsive layout for all device sizes
  - On mobile, task cards show only title and due date for clarity; delete icon is hidden
  - Floating action buttons for adding tasks and chatting with AI
  - Modal dialogs for task creation and AI chat

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **TypeScript** - Type-safe JavaScript
- **date-fns** - Date utility library
- **Lucide React** - Icon library

gorlea-tasks/
├── app/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/
│   ├── add-task-button.tsx   # Floating add task button
│   ├── add-task-modal.tsx    # Modal for adding tasks
│   ├── app-bar.tsx           # Top application bar
│   ├── chat-button.tsx       # Floating chat button
│   ├── chat-modal.tsx        # AI chat interface
│   ├── empty-state.tsx       # Empty state for task list
│   ├── task-list.tsx         # List of tasks
│   ├── task-row.tsx          # Individual task component
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── types.ts          # TypeScript interfaces
├── public/
│   └── images/           # Images and assets
├── tailwind.config.ts    # Tailwind configuration
└── next.config.mjs       # Next.js configuration

## Installation

### Prerequisites

- Node.js 18.17.0 or later
- npm

## Future Enhancements

- Task filtering and sorting
- Task editing (via details modal)
- Task deletion (delete icon on desktop, long-press on mobile)
- Task categories/tags
- User authentication
- Data persistence
- Calendar view
- Notifications
- Advanced AI features (task suggestions, reminders, etc.)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gorlea-tasks.git
cd gorlea-tasks
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local` with necessary Firebase and Gemini API keys.

4. Run the development server:

```bash
npm run dev
