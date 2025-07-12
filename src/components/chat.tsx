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
import Image from "next/image";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { usePlateDialog } from "@/providers/plate-dialog-provider";

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  plate: Plate;
}
export function Chat({ className, plate, ...props }: ChatProps) {
  const chatStartedRef = useRef(false);
  const { chat } = usePlateDialog();

  const { messages, input, handleInputChange, handleSubmit, reload } = chat;

  useEffect(() => {
    if (chatStartedRef.current) return;
    chatStartedRef.current = true;
    reload();
  }, [reload]);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-h-0">
          <ChatList className="p-6">
            <MessageWithPlateImage imageUrl={plate.imageUrl} />
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </ChatList>
        </div>
      </div>
      <form
        className="flex items-end gap-3 border-t p-2"
        onSubmit={handleSubmit}
      >
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

function MessageWithPlateImage({ imageUrl }: { imageUrl: string }) {
  return (
    <ChatMessage variant="user" status="sent">
      <ChatMessageContent className="text-white">
        <Image
          src={imageUrl}
          alt="Plate"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </ChatMessageContent>
    </ChatMessage>
  );
}

function Message({ message }: { message: TMessage }) {
  if (message.role === "user") {
    return (
      <ChatMessage variant="user" status="sent">
        <ChatMessageContent className="text-white">
          <MemoizedMarkdown id={message.id} content={message.content} />
        </ChatMessageContent>
      </ChatMessage>
    );
  }

  if (message.role === "assistant") {
    return (
      <ChatMessage variant="assistant" status="sent">
        <ChatMessageContent>
          <MemoizedMarkdown id={message.id} content={message.content} />
        </ChatMessageContent>
      </ChatMessage>
    );
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
