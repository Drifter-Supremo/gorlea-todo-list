import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
} from "firebase/firestore";

export interface Task {
  id?: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

// Add a new task for a user
export async function addTask(userId: string, task: Omit<Task, "id">): Promise<DocumentReference<DocumentData>> {
  return await addDoc(collection(db, "users", userId, "tasks"), {
    ...task,
    dueDate: Timestamp.fromDate(task.dueDate),
  });
}

// Get all tasks for a user
export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(collection(db, "users", userId, "tasks"));
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      dueDate: (data.dueDate && data.dueDate.toDate) ? data.dueDate.toDate() : new Date(data.dueDate),
      completed: data.completed,
      priority: data.priority,
    } as Task;
  });
}

// Update a user's task
export async function updateTask(userId: string, id: string, updates: Partial<Omit<Task, "id">>): Promise<void> {
  const taskRef = doc(db, "users", userId, "tasks", id);
  // Build a new object for Firestore, converting dueDate if needed
  const firestoreUpdates: Record<string, any> = { ...updates };
  if (updates.dueDate instanceof Date) {
    firestoreUpdates.dueDate = Timestamp.fromDate(updates.dueDate);
  }
  await updateDoc(taskRef, firestoreUpdates);
}

// Delete a user's task
export async function deleteTask(userId: string, id: string): Promise<void> {
  const taskRef = doc(db, "users", userId, "tasks", id);
  await deleteDoc(taskRef);
}
