"use client";

import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useToast } from "../../components/ui/use-toast";
import { parseTask } from "../lib/parseTask";
import { addTask } from "../lib/firestore";

export function ChatModal() {
  const { toast } = useToast();
  
  return (
    <Dialog>
      <DialogContent>
        <ScrollArea className="h-[400px]">
          {/* Chat messages will be displayed here */}
        </ScrollArea>
        <div className="flex gap-2">
          <Input placeholder="Enter your task..." />
          <Button onClick={async () => {
            const inputElement = document.querySelector('input[placeholder="Enter your task..."]') as HTMLInputElement;
            if (inputElement && inputElement.value.trim()) {
              const parsed = await parseTask(inputElement.value);
              await addTask({
                title: parsed.title,
                details: parsed.details,
                dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
                priority: parsed.priority
              });
              toast({ title: "✅ Task added!" });
              inputElement.value = '';
            }
          }}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
