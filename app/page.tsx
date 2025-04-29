"use client"

import { useState } from "react"
import { TaskList } from "@/components/task-list"
import { AppBar } from "@/components/app-bar"
import { AddTaskButton } from "@/components/add-task-button"
import { AddTaskModal } from "@/components/add-task-modal"
import type { Task } from "@/lib/types"
import { ChatButton } from "@/components/chat-button"
import { ChatModal } from "@/components/chat-modal"

// Mock initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    priority: "high",
  },
  {
    id: "2",
    title: "Review team documentation",
    completed: true,
    dueDate: new Date(Date.now() - 86400000), // 1 day ago
    priority: "medium",
  },
  {
    id: "3",
    title: "Prepare for client meeting",
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    priority: "low",
  },
]

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Add a new task
  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      completed: false,
      ...task,
    }
    setTasks([...tasks, newTask])
    setIsModalOpen(false)
  }

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Handle sign in/out
  const toggleSignIn = () => {
    setIsSignedIn(!isSignedIn)
  }

  return (
    <div className="min-h-screen bg-[#032934] text-[#F5E8C2] flex flex-col">
      <AppBar isSignedIn={isSignedIn} onSignInToggle={toggleSignIn} />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          <TaskList tasks={tasks} onToggleCompletion={toggleTaskCompletion} />
        </div>
      </main>

      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      <ChatButton onClick={() => setIsChatModalOpen(true)} />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={addTask} />
      <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
    </div>
  )
}
