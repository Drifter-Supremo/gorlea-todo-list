"use client"

import { Button } from "./ui/button"
import { Plus } from "lucide-react"

interface AddTaskButtonProps {
  onClick: () => void
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] shadow-lg"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Add Task</span>
    </Button>
  )
}
