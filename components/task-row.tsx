"use client"

import { Checkbox } from "./ui/checkbox"
import { Badge } from "./ui/badge"
import type { Task } from "../src/lib/types"
import { format, isToday, isTomorrow, isPast } from "date-fns"

interface TaskRowProps {
  task: Task
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

import { Trash, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"

export function TaskRow({ task, onToggleCompletion, onDelete, onEdit }: TaskRowProps) {
  // Long-press state
  const [showActionModal, setShowActionModal] = useState(false)
  let longPressTimer: number | null = null

  // Long-press handlers
  const handleTouchStart = () => {
    longPressTimer = window.setTimeout(() => setShowActionModal(true), 500)
  }
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
  }
  // Format the due date
  const formatDueDate = (date: Date | null | undefined) => {
    if (!date || isNaN(date.getTime())) return "No Date"

    // Check if the task is overdue
    if (isPast(date) && !task.completed) {
      return "Overdue"
    } else if (isToday(date)) {
      return "Today"
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return format(date, "MMM d")
    }
  }

  // Determine badge color based on priority and due date
  const getBadgeVariant = () => {
    if (task.dueDate && !isNaN(task.dueDate.getTime()) && isPast(task.dueDate) && !task.completed) {
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
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  return (
    <>
      <div
        className="p-3 rounded-md bg-[#032934] border border-[#F5E8C2]/10 hover:border-[#F5E8C2]/20 transition-colors cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onClick={() => setShowDetailsModal(true)}
      >
        {/* Desktop layout (hidden on small screens) */}
        <div className="hidden sm:flex items-center space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="border-[#F29600] data-[state=checked]:bg-[#F29600] data-[state=checked]:text-[#032934]"
            onClick={e => e.stopPropagation()}
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${task.completed ? "line-through text-[#F5E8C2]/50" : "text-[#F5E8C2]"}`}
            >
              {task.title.length > 32 ? task.title.slice(0, 32) + "..." : task.title}
            </p>
          </div>
          <Badge variant={getBadgeVariant() as any} className="ml-auto">
            {formatDueDate(task.dueDate)}
          </Badge>
          <button
            title="Delete Task"
            className="ml-1 p-1 rounded hover:bg-red-600/20 text-[#F5E8C2]"
            onClick={e => { e.stopPropagation(); setShowDeleteDialog(true); }}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile layout (visible only on small screens) */}
        <div className="flex flex-col space-y-2 sm:hidden">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="border-[#F29600] data-[state=checked]:bg-[#F29600] data-[state=checked]:text-[#032934]"
              onClick={e => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${task.completed ? "line-through text-[#F5E8C2]/50" : "text-[#F5E8C2]"}`}
              >
                {task.title}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Badge variant={getBadgeVariant() as any}>
              {formatDueDate(task.dueDate)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Long-press Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20 max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-[#F29600] text-center">Task Actions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Button onClick={() => { setShowActionModal(false); setShowDeleteDialog(true); }} variant="destructive" className="bg-red-600 hover:bg-red-700">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

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
      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20 max-w-md w-full">
          <DialogHeader>
            <DialogTitle className="text-[#F29600]">Task Details</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="mb-2">
              <span className="font-semibold text-[#F29600]">Due:</span>{" "}
              {task.dueDate ? format(task.dueDate, "PPP p") : "No Due Date"}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-[#F29600]">Priority:</span>{" "}
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "No Priority"}
            </div>
            <div>
              <span className="font-semibold text-[#F29600]">Details</span>
              <div className="whitespace-pre-line mt-1">{task.details || <span className="italic text-[#F5E8C2]/60">No details</span>}</div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934]"
              onClick={() => { setShowDetailsModal(false); onEdit(task); }}
            >
              Edit Task
            </Button>
            <Button
              variant="ghost"
              className="text-[#F5E8C2]"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
