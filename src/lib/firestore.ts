import { collection, doc, addDoc, updateDoc, deleteDoc, query, getDocs } from "firebase/firestore"
import type { Task, TaskInput } from "./types"
import { getFirebase } from "./firebase"

export async function addTask(data: TaskInput & { userId: string }): Promise<string> {
  const { userId, ...taskData } = data
  const db = getFirebase().db!
  const ref = await addDoc(collection(db, "users", userId, "tasks"), { ...taskData, completed: false })
  return ref.id
}

export async function updateTask(task: Omit<Task, 'id'> & { id: string, userId: string }): Promise<void> {
  const { userId, id, ...updates } = task
  const db = getFirebase().db!
  const ref = doc(db, "users", userId, "tasks", id)
  await updateDoc(ref, updates)
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const db = getFirebase().db!
  const ref = doc(db, "users", userId, "tasks", taskId)
  await deleteDoc(ref)
}

export async function getTasks(userId: string): Promise<Task[]> {
  if (!userId) return []
  const db = getFirebase().db!
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
