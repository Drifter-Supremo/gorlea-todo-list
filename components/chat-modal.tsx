"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm Gorlea, your AI assistant. How can I help you with your tasks today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      const aiResponses = [
        "I can help you organize those tasks!",
        "Would you like me to suggest a priority for your upcoming tasks?",
        "I notice you have several tasks due soon. Need help planning your schedule?",
        "I can analyze your task patterns if you'd like some productivity insights.",
        "Let me know if you need help breaking down any of your larger tasks.",
      ]

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20 p-0 sm:max-w-[500px] max-h-[80vh] flex flex-col"
        onInteractOutside={onClose}
      >
        {/* Chat header */}
        <div className="p-4 border-b border-[#F5E8C2]/10 flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#F29600] flex items-center justify-center mr-3">
            <span className="text-[#032934] font-bold">G</span>
          </div>
          <h2 className="text-lg font-semibold">Chat with Gorlea</h2>
        </div>

        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user" ? "bg-[#F29600] text-[#032934]" : "bg-[#F5E8C2]/10 text-[#F5E8C2]"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat input */}
        <div className="p-4 border-t border-[#F5E8C2]/10 flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] focus-visible:ring-[#F29600]"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] px-3"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
