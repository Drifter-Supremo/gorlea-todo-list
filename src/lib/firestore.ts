import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, query, getDocs } from "firebase/firestore"
import { auth } from "./firebase"
import type { Task, TaskInput } from "./types"

const db = getFirestore()

export async function addTask(data: TaskInput): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error("AUTH_REQUIRED")
  const ref = await addDoc(collection(db, "users", user.uid, "tasks"), { ...data, completed: false })
  return ref.id
}

export async function updateTask(id: string, updates: Partial<TaskInput>): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error("AUTH_REQUIRED")
  const ref = doc(db, "users", user.uid, "tasks", id)
  await updateDoc(ref, updates)
}

export async function deleteTask(id: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error("AUTH_REQUIRED")
  const ref = doc(db, "users", user.uid, "tasks", id)
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
