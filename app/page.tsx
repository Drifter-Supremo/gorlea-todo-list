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

  // Environment variables are loaded from .env.local

  // Fetch tasks from Firestore on load and after changes
  const refreshTasks = useCallback(() => {
    if (!userId) {
      setTasks([]); // Clear tasks when no user is logged in
      return;
    }
    getTasks(userId).then(setTasks).catch(() => setTasks([]))
  }, [userId])

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks, userId])

  // Add a new task
  async function handleAddTask(data: TaskInput): Promise<string> {
    const newId = await addTask({ ...data, userId })
    setTasks(ts => [...ts, { id: newId, completed: false, ...data }])
    return newId
  }

  // Update a task
  async function handleUpdateTask(id: string, updates: Partial<TaskInput> & { completed?: boolean }): Promise<void> {
    // Find the existing task to get current values
    const existingTask = tasks.find(task => task.id === id);
    if (!existingTask) return;

    // Ensure required fields have default values if not provided in updates
    const taskUpdates = {
      id,
      userId,
      title: updates.title !== undefined ? updates.title : existingTask.title || '',
      details: updates.details !== undefined ? updates.details : existingTask.details || '',
      dueDate: updates.dueDate !== undefined ? updates.dueDate : existingTask.dueDate || null,
      priority: updates.priority !== undefined ? updates.priority : existingTask.priority || 'medium',
      completed: updates.completed !== undefined ? updates.completed : existingTask.completed
    };

    await updateTask(taskUpdates);

    // Create a complete updated task with all properties preserved
    const updatedTask = { ...existingTask, ...updates };
    setTasks(ts => ts.map(task => task.id === id ? updatedTask : task));
  }

  // Delete a task
  async function handleDeleteTask(id: string): Promise<void> {
    await deleteTask(id, userId)
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
