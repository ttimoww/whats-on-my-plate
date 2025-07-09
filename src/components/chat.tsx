"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Chat({ className, ...props }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className={cn("flex h-full flex-col p-4", className)} {...props}>
      <div className="mb-auto">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      <form
        className="flex items-end gap-3"
        onSubmit={(e) => {
          handleSubmit(e, {
            data: {
              imageUrl:
                "https://fastly.picsum.photos/id/405/500/500.jpg?hmac=kALs-x5LPK5UEWmXyaLbtUhr2eBuZotJlNJdzm0wlXk",
            },
          });
        }}
      >
        <Textarea
          placeholder="Message"
          value={input}
          onChange={handleInputChange}
          rows={1}
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
