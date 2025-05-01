"use client"

import { useState, useEffect, useCallback } from "react"
import { TaskList } from "../components/task-list"
import { AppBar } from "../components/app-bar"
import { AddTaskButton } from "../components/add-task-button"
import { AddTaskModal } from "../components/add-task-modal"
import type { Task, TaskInput } from "../src/lib/types"
import { ChatButton } from "../components/chat-button"
import { ChatModal } from "../components/chat-modal"
import { getTasks, addTask, updateTask, deleteTask } from "../src/lib/firestore"
import { useAuth } from "../hooks/useAuth"

export default function Home() {
  const { user, loading } = useAuth();
  const userId = user?.uid || "";
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  // Fetch tasks from Firestore on load and after changes
  const refreshTasks = useCallback(() => {
    if (!userId) return
    getTasks(userId).then(setTasks).catch(() => setTasks([]))
  }, [userId])

  useEffect(() => {
    if (userId) refreshTasks()
  }, [refreshTasks, userId])

  // Add a new task
  async function handleAddTask(data: TaskInput): Promise<string> {
    const newId = await addTask(data)
    setTasks(ts => [...ts, { id: newId, completed: false, ...data }])
    return newId
  }

  // Update a task
  async function handleUpdateTask(id: string, updates: Partial<TaskInput>): Promise<void> {
    await updateTask(id, updates)
    setTasks(ts => ts.map(task => task.id === id ? { ...task, ...updates } : task))
  }

  // Delete a task
  async function handleDeleteTask(id: string): Promise<void> {
    await deleteTask(id)
    setTasks(ts => ts.filter(task => task.id !== id))
  }

  // Toggle task completion status
  const toggleTaskCompletion = async (id: string) => {
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    await handleUpdateTask(id, { completed: !target.completed } as any)
  }

  // Edit a task (open modal)
  const handleEditTask = useCallback((task: Task) => {
    setEditTask(task)
    setIsEditModalOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#032934] text-[#F5E8C2] flex flex-col">
      <AppBar />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          <TaskList
            tasks={tasks}
            onToggleCompletion={toggleTaskCompletion}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        </div>
      </main>

      <AddTaskButton onClick={() => setIsModalOpen(true)} />
      <ChatButton onClick={() => setIsChatModalOpen(true)} />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleAddTask} />
      {/* Edit Task Modal - reuse AddTaskModal with prefilled values */}
      {editTask && (
        <AddTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditTask(null)
          }}
          onAddTask={async (data) => {
            if (editTask) await handleUpdateTask(editTask.id, data)
            setIsEditModalOpen(false)
            setEditTask(null)
            return editTask?.id || ""
          }}
          key={editTask.id}
          // @ts-ignore
          initialValues={editTask}
        />
      )}
      <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} refreshTasks={refreshTasks} />
    </div>
  )
}
