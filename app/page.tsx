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

import { useAuth } from "@/hooks/useAuth"
import { getTasks, addTask as addTaskFirestore, updateTask as updateTaskFirestore, deleteTask as deleteTaskFirestore } from "@/lib/firestore"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth();
  const userId = user?.uid;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Fetch tasks from Firestore when user is signed in
  useEffect(() => {
    if (userId) {
      getTasks(userId).then((tasks) => {
        // Ensure every task has a string id
        setTasks(tasks.filter((t): t is Task => !!t.id));
      }).catch(() => setTasks([]));
    } else {
      setTasks([]);
    }
  }, [userId]);

  // Add a new task
  const addTask = async (task: Omit<Task, "id" | "completed">) => {
    if (!userId) return;
    const newTask = { ...task, completed: false };
    const docRef = await addTaskFirestore(userId, newTask);
    setTasks([...tasks, { ...newTask, id: docRef.id }]);
    setIsModalOpen(false);
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id: string) => {
    if (!userId) return;
    const target = tasks.find((task) => task.id === id);
    if (!target) return;
    const updated = { ...target, completed: !target.completed };
    await updateTaskFirestore(userId, id, { completed: updated.completed });
    setTasks(tasks.map((task) => (task.id === id ? updated : task)));
  };

  // Delete a task (if desired, e.g. add a delete button and call this)
  const deleteTask = async (id: string) => {
    if (!userId) return;
    await deleteTaskFirestore(userId, id);
    setTasks(tasks.filter((task) => task.id !== id));
  };


  return (
    <div className="min-h-screen bg-[#032934] text-[#F5E8C2] flex flex-col">
      <AppBar />

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
