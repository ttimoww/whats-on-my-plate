"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Plate } from "@prisma/client";
import { useEffect, useRef } from "react";

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  plate: Plate;
}
export function Chat({ className, plate, ...props }: ChatProps) {
  const startedRef = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, status, reload } =
    useChat({
      api: `/api/chat`,
      body: {
        plateId: plate.id,
      },
      initialMessages: [
        {
          id: "1",
          role: "user",
          content: "What's on my plate?", // This message is overwritten serverside
        },
      ],
    });

  useEffect(() => {
    if (startedRef.current) return;

    startedRef.current = true;
    reload();
  }, [reload]);

  return (
    <div className={cn("flex h-full flex-col p-4", className)} {...props}>
      <p>{status}</p>
      <div className="mb-auto">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      <form className="flex items-end gap-3" onSubmit={handleSubmit}>
        <Input
          placeholder="Message"
          value={input}
          onChange={handleInputChange}
          className="min-h-[44px] resize-none rounded-2xl pe-12"
        />
        <Button
          size="icon"
          type="submit"
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
