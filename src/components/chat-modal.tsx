"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useToast } from "../../components/ui/use-toast";
import { parseTask } from "../lib/parseTask";
import { addTask } from "../lib/firestore";

export function ChatModal() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  
  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const parsed = await parseTask(input);
      await addTask({
        title: parsed.title,
        details: parsed.details,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        priority: parsed.priority
      });
      toast({ title: "✅ Task added!" });
      setInput("");
    } catch (error) {
      console.error("Error adding task via chat:", error);
      toast({ title: "Error", description: "Failed to add task. Please try again." });
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <ScrollArea className="h-[400px]">
          {/* Chat messages will be displayed here */}
        </ScrollArea>
        <div className="flex gap-2">
          <Input 
            placeholder="Enter your task..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
