"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, "id" | "completed">) => void
  initialValues?: Partial<Omit<Task, "completed">>
}

export function AddTaskModal({ isOpen, onClose, onAddTask, initialValues }: AddTaskModalProps) {
  const [title, setTitle] = useState(initialValues?.title || "")
  const [dueDate, setDueDate] = useState<Date>(initialValues?.dueDate ? new Date(initialValues.dueDate) : new Date())
  const [priority, setPriority] = useState<Task["priority"]>(initialValues?.priority || "medium")

  const handleSubmit = () => {
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      dueDate,
      priority,
    })

    // Reset form only if adding (not editing)
    if (!initialValues) {
      setTitle("")
      setDueDate(new Date())
      setPriority("medium")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#F5E8C2]">
            {initialValues ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[#F5E8C2]">
              Task Title
            </Label>
            <Textarea
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] focus-visible:ring-[#F29600]"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-[#F5E8C2]">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] hover:bg-[#032934]/90 hover:text-[#F5E8C2]",
                    !dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#032934] border-[#F5E8C2]/20">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                  className="bg-[#032934] text-[#F5E8C2]"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority" className="text-[#F5E8C2]">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger
                id="priority"
                className="bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] focus:ring-[#F29600]"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#032934] border-[#F5E8C2]/20">
                <SelectItem value="low" className="text-[#F5E8C2] focus:bg-[#F29600]/20">
                  Low
                </SelectItem>
                <SelectItem value="medium" className="text-[#F5E8C2] focus:bg-[#F29600]/20">
                  Medium
                </SelectItem>
                <SelectItem value="high" className="text-[#F5E8C2] focus:bg-[#F29600]/20">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934]"
            disabled={!title.trim()}
          >
            {initialValues ? "Save Changes" : "Save Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
