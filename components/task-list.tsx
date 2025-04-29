"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskRow } from "@/components/task-row"
import { EmptyState } from "@/components/empty-state"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
}

export function TaskList({ tasks, onToggleCompletion }: TaskListProps) {
  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Sort tasks by due date (earliest first)
  const sortedIncompleteTasks = [...incompleteTasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  return (
    <Card className="bg-[#032934] border border-[#F5E8C2]/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#F5E8C2]">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {/* Incomplete tasks section */}
              {sortedIncompleteTasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-[#F5E8C2]/70">To Do</h3>
                  <div className="space-y-2">
                    {sortedIncompleteTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onToggleCompletion={onToggleCompletion} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed tasks section */}
              {completedTasks.length > 0 && (
                <div className="space-y-2 mt-6">
                  <h3 className="text-sm font-medium text-[#F5E8C2]/70">Completed</h3>
                  <div className="space-y-2 opacity-70">
                    {completedTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onToggleCompletion={onToggleCompletion} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
