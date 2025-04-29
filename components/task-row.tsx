"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"
import { format, isToday, isTomorrow, isPast } from "date-fns"

interface TaskRowProps {
  task: Task
  onToggleCompletion: (id: string) => void
}

export function TaskRow({ task, onToggleCompletion }: TaskRowProps) {
  // Format the due date
  const formatDueDate = (date: Date) => {
    if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return format(date, "MMM d")
    }
  }

  // Determine badge color based on priority and due date
  const getBadgeVariant = () => {
    if (isPast(task.dueDate) && !task.completed) {
      return "destructive"
    }

    switch (task.priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-md bg-[#032934] border border-[#F5E8C2]/10 hover:border-[#F5E8C2]/20 transition-colors">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleCompletion(task.id)}
        className="border-[#F29600] data-[state=checked]:bg-[#F29600] data-[state=checked]:text-[#032934]"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${task.completed ? "line-through text-[#F5E8C2]/50" : "text-[#F5E8C2]"}`}
        >
          {task.title}
        </p>
      </div>
      <Badge variant={getBadgeVariant() as any} className="ml-auto">
        {formatDueDate(task.dueDate)}
      </Badge>
    </div>
  )
}
