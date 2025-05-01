export interface Task {
  id: string;
  title: string;
  details?: string;
  dueDate?: Date | null;
  priority?: 'low' | 'medium' | 'high';
  completed: boolean;
  userId?: string; // server-side only
}

export type TaskInput = Omit<Task, 'id' | 'completed'> & { userId: string };

export interface ParsedTask {
  title: string;
  details: string;
  datePhrase?: string;
  priority?: string;
}
