"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { CpuIcon, Loader2, SendIcon } from "lucide-react";
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
import type { ToolName } from "@/app/api/chat/route";

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

  return (
    <ChatMessage variant="assistant" status="sent">
      <div className="space-y-2">
        {message.parts?.map((part, i) => {
          const key = `${message.id}-${i}`;
          return (
            <MessagePart key={key} messagePart={part} messageId={message.id} />
          );
        })}
      </div>
    </ChatMessage>
  );
}

interface MessagePartProps {
  messagePart: UIMessage["parts"][number];
  messageId: string;
}
function MessagePart({ messagePart, messageId }: MessagePartProps) {
  if (messagePart.type === "text") {
    return (
      <ChatMessageContent>
        <MemoizedMarkdown id={messageId} content={messagePart.text} />
      </ChatMessageContent>
    );
  }

  if (messagePart.type === "tool-invocation") {
    const toolCallId = messagePart.toolInvocation.toolCallId;

    // Other tools
    const toolName = messagePart.toolInvocation.toolName as ToolName;
    if (messagePart.toolInvocation.state === "call") {
      return (
        <p className="bg-muted/70 text-muted-foreground w-fit rounded-full px-2 py-1 text-[10px] font-medium">
          <Loader2 className="inline size-3 animate-spin" /> {toolName}
        </p>
      );
    }

    return (
      <p className="bg-muted/70 text-muted-foreground w-fit rounded-full px-2 py-1 text-[10px] font-medium">
        <CpuIcon className="inline size-3" /> {toolName}
      </p>
    );
  }
}
