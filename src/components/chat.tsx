"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Plate } from "@prisma/client";
import { useEffect, useRef } from "react";
import {
  ChatMessage,
  ChatMessageContent,
  ChatList,
} from "@/components/ui/chat-message";
import type { Message as TMessage, UIMessage } from "ai";

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
    <div
      className={cn(
        "flex h-full max-h-full flex-col gap-2 border border-blue-400 p-4",
        className,
      )}
      {...props}
    >
      <ChatList className="flex-1 overflow-y-auto border border-red-400">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ChatList>

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

function Message({ message }: { message: TMessage }) {
  if (message.role === "user") {
    return (
      <ChatMessage variant="user" status="sent">
        <ChatMessageContent className="text-white">
          {message.content}
        </ChatMessageContent>
      </ChatMessage>
    );
  }

  if (message.role === "assistant") {
    return (
      <ChatMessage variant="assistant" status="sent">
        <div className="space-y-2">
          {message.parts?.map((part, i) => {
            const key = `${message.id}-${i}`;
            return <MessagePart key={key} messagePart={part} />;
          })}
        </div>
      </ChatMessage>
    );
  }
}

interface MessagePartProps extends React.HTMLAttributes<HTMLDivElement> {
  messagePart: UIMessage["parts"][number];
}

function MessagePart({ messagePart, className, ...props }: MessagePartProps) {
  if (messagePart.type === "text") {
    return <ChatMessageContent>{messagePart.text}</ChatMessageContent>;
  }
}
