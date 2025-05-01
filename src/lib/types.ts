export interface Task {
  id: string
  title: string
  details?: string
  dueDate?: Date | null
  priority?: string
  completed: boolean
}

export type TaskInput = Omit<Task, "id" | "completed">
