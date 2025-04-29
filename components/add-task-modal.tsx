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

function generateTimeOptions() {
  const options = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = ((h + 11) % 12) + 1
      const ampm = h < 12 ? "AM" : "PM"
      const label = `${hour}:${m.toString().padStart(2, "0")} ${ampm}`
      options.push({
        value: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        label,
      })
    }
  }
  return options
}

export function AddTaskModal({ isOpen, onClose, onAddTask, initialValues }: AddTaskModalProps) {
  const [title, setTitle] = useState(initialValues?.title || "")
  const [dueDate, setDueDate] = useState<Date>(initialValues?.dueDate ? new Date(initialValues.dueDate) : new Date())
  const [priority, setPriority] = useState<Task["priority"]>(initialValues?.priority || "medium")
  // Time picker state (default to 09:00 AM if adding, or extract from dueDate if editing)
  const initialTime = initialValues?.dueDate
    ? `${new Date(initialValues.dueDate).getHours().toString().padStart(2, "0")}:${new Date(initialValues.dueDate).getMinutes().toString().padStart(2, "0")}`
    : "09:00"
  const [time, setTime] = useState(initialTime)
  const timeOptions = generateTimeOptions()

  const handleSubmit = () => {
    if (!title.trim()) return

    // Combine dueDate and time
    const [hours, minutes] = time.split(":").map(Number)
    const due = new Date(dueDate)
    due.setHours(hours, minutes, 0, 0)

    onAddTask({
      title: title.trim(),
      dueDate: due,
      priority,
    })

    // Reset form only if adding (not editing)
    if (!initialValues) {
      setTitle("")
      setDueDate(new Date())
      setPriority("medium")
      setTime("09:00")
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

          {/* Time Picker */}
          <div className="grid gap-2">
            <Label htmlFor="time" className="text-[#F5E8C2]">
              Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time" className="bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] focus:ring-[#F29600]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-[#032934] border-[#F5E8C2]/20 max-h-60 overflow-y-auto">
                {timeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-[#F5E8C2] focus:bg-[#F29600]/20">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
