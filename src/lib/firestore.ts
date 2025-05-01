import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, query, getDocs } from "firebase/firestore"
import type { Task, TaskInput } from "./types"

const db = getFirestore()

export async function addTask(data: TaskInput & { userId: string }): Promise<string> {
  const { userId, ...taskData } = data
  const ref = await addDoc(collection(db, "users", userId, "tasks"), { ...taskData, completed: false })
  return ref.id
}

export async function updateTask(task: Omit<Task, 'id' | 'completed'> & { id: string, userId: string }): Promise<void> {
  const { userId, id, ...updates } = task
  const ref = doc(db, "users", userId, "tasks", id)
  await updateDoc(ref, updates)
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const ref = doc(db, "users", userId, "tasks", taskId)
  await deleteDoc(ref)
}

export async function getTasks(userId: string): Promise<Task[]> {
  if (!userId) return []
  const q = query(collection(db, "users", userId, "tasks"))
  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      dueDate: data.dueDate ? (data.dueDate.toDate ? data.dueDate.toDate() : new Date(data.dueDate)) : null
    } as Task;
  })
}
