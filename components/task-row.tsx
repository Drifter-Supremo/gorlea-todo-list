"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"
import { format, isToday, isTomorrow, isPast } from "date-fns"

interface TaskRowProps {
  task: Task
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

import { Trash, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function TaskRow({ task, onToggleCompletion, onDelete, onEdit }: TaskRowProps) {
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
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
      <button
        title="Edit Task"
        className="ml-2 p-1 rounded hover:bg-[#F29600]/20 text-[#F5E8C2]"
        onClick={() => onEdit(task)}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        title="Delete Task"
        className="ml-1 p-1 rounded hover:bg-red-600/20 text-[#F5E8C2]"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20">
          <DialogHeader>
            <DialogTitle className="text-[#F29600]">Delete Task?</DialogTitle>
          </DialogHeader>
          <div className="py-2">Are you sure you want to delete?</div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)} className="text-[#F5E8C2]">Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(task.id); setShowDeleteDialog(false); }} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

