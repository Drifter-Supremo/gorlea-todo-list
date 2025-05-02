"use client"

import { useState, useRef, useEffect } from "react"
import { addTask } from "../src/lib/firestore"
import { toast } from "./ui/use-toast"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { ScrollArea } from "./ui/scroll-area"
import { Send } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  refreshTasks?: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatModal({ isOpen, onClose, refreshTasks }: ChatModalProps) {
  const { user } = useAuth();
  const userId = user?.uid;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm Gorlea, your AI assistant. How can I help you with your tasks today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Call API route to parse task
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          userId: userId || "anonymous-user"
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Parse the response but we don't need the result for the confirmation message
      await response.json()

      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `✅ Task created!`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])

      // Don't close the modal, just refresh tasks and clear input
      if (refreshTasks) refreshTasks()
      setInput("")

      // Show a minimal toast notification
      toast({ title: "✅ Task created" })
    } catch (error) {
      console.error('Error processing task:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
      toast({ title: "Error", description: "Failed to add task", variant: "destructive" })
    }

    // Input is cleared after successful task creation in the try block
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#032934] text-[#F5E8C2] border-[#F5E8C2]/20 p-0 sm:max-w-[500px] max-h-[80vh] flex flex-col"
        onInteractOutside={onClose}
        aria-describedby="dialog-description"
      >
        <span id="dialog-description" style={{ display: 'none' }}>Chat dialog for interacting with Gorlea, your AI task assistant.</span>
        <DialogHeader className="pt-4 px-4">
          <DialogTitle className="ml-2 mt-1">Chat with Gorlea</DialogTitle>
        </DialogHeader>
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
        <div className="p-4 border-t border-[#F5E8C2]/10 flex items-center gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-[#032934] border-[#F5E8C2]/20 text-[#F5E8C2] focus-visible:ring-[#F29600] min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSend}
            className="bg-[#F29600] hover:bg-[#F29600]/90 text-[#032934] px-3 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
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
