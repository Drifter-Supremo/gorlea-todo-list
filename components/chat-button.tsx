"use client"

import { Button } from "./ui/button"
import { MessageSquare } from "lucide-react"

interface ChatButtonProps {
  onClick: () => void
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 left-6 md:bottom-6 md:left-6 w-14 h-14 rounded-full bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] shadow-lg"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Chat with Gorlea</span>
    </Button>
  )
}
