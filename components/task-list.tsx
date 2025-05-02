"use client"

import { ScrollArea } from "./ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { TaskRow } from "./task-row"
import { EmptyState } from "./empty-state"
import type { Task } from "../src/lib/types"
import { isPast } from "date-fns"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export function TaskList({ tasks, onToggleCompletion, onDelete, onEdit }: TaskListProps) {
  const [isCompletedOpen, setIsCompletedOpen] = useState(false)
  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Sort tasks by overdue status first, then by due date (earliest first)
  const sortedIncompleteTasks = [...incompleteTasks].sort((a, b) => {
    // Check if tasks are overdue
    const aIsOverdue = a.dueDate && !isNaN(a.dueDate.getTime()) && isPast(a.dueDate);
    const bIsOverdue = b.dueDate && !isNaN(b.dueDate.getTime()) && isPast(b.dueDate);

    // Sort overdue tasks first
    if (aIsOverdue && !bIsOverdue) return -1;
    if (!aIsOverdue && bIsOverdue) return 1;

    // If both are overdue or both are not overdue, sort by due date
    if (!a.dueDate) return 1;  // Tasks without due dates go last
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  })

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
                      <TaskRow key={task.id} task={task} onToggleCompletion={onToggleCompletion} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed tasks section */}
              {completedTasks.length > 0 && (
                <div className="mt-6">
                  <Collapsible
                    open={isCompletedOpen}
                    onOpenChange={setIsCompletedOpen}
                    className="space-y-2"
                  >
                    <div className="flex items-center">
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-[#F5E8C2]/70 hover:text-[#F5E8C2] transition-colors">
                        {isCompletedOpen ? (
                          <ChevronDown className="h-4 w-4 text-[#F29600]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-[#F29600]" />
                        )}
                        <h3>Completed ({completedTasks.length})</h3>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2 opacity-70">
                      {completedTasks.map((task) => (
                        <TaskRow key={task.id} task={task} onToggleCompletion={onToggleCompletion} onDelete={onDelete} onEdit={onEdit} />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
