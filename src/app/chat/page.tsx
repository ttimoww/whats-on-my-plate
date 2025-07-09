"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedGrid } from "@/components/ui/dotted-grid";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { SendIcon } from "lucide-react";
import { useCallback } from "react";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function ChatPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="mx-auto grid min-h-[500px] w-full max-w-4xl overflow-hidden py-0">
        <CardContent className="grid grid-cols-2 px-0">
          <div className="bg-border/10 border-border relative col-span-1 border-r">
            <DottedGrid />
          </div>
          <div className="col-span-1">
            <Chat />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  return (
    <div className="flex h-full flex-col border p-4">
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
