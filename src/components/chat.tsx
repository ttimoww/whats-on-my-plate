"use client";

import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { CheckIcon, CpuIcon, Loader2, SendIcon } from "lucide-react";
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
import { useStickToBottom } from "use-stick-to-bottom";
import { Badge } from "@/components/ui/badge";

const toolDisplayNames: Record<ToolName, { call: string; result: string }> = {
  saveNutritionalInfo: {
    call: "Macro's",
    result: "Macro's",
  },
  saveHealthScore: {
    call: "Health Score",
    result: "Health Score",
  },
};

interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  plate: Plate;
}
export function Chat({ className, plate, ...props }: ChatProps) {
  const chatStartedRef = useRef(false);
  const { chat } = usePlateDialog();
  const { scrollRef, contentRef } = useStickToBottom();

  const { messages, input, handleInputChange, handleSubmit, reload } = chat;

  useEffect(() => {
    if (chatStartedRef.current) return;
    chatStartedRef.current = true;
    void reload();
  }, [reload]);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        <div className="max-h-0">
          <ChatList className="p-6" ref={contentRef}>
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

    const toolName = messagePart.toolInvocation.toolName as ToolName;
    const { state } = messagePart.toolInvocation;

    return (
      <Badge
        variant={state === "result" ? "success" : "outline"}
        className="mr-2 w-fit transition-all"
      >
        {state === "result" ? (
          <CheckIcon className="inline size-3" />
        ) : (
          <Loader2 className="inline size-3 animate-spin" />
        )}{" "}
        {toolDisplayNames[toolName].result}
      </Badge>
    );
  }
}
