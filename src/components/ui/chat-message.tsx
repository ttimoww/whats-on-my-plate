"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCheck, AlertCircle, Loader2 } from "lucide-react";

const chatMessageVariants = cva("flex gap-x-2 sm:gap-x-4", {
  variants: {
    variant: {
      assistant: "max-w-lg me-11",
      user: "ms-auto",
      system: "max-w-lg me-11",
    },
  },
  defaultVariants: {
    variant: "assistant",
  },
});

const chatBubbleVariants = cva("rounded-2xl p-2.5", {
  variants: {
    variant: {
      assistant: "bg-white border border-gray-200",
      user: "bg-primary text-primary-foreground shadow-2xs",
      system: "bg-white border border-gray-200",
    },
  },
  defaultVariants: {
    variant: "assistant",
  },
});

const chatStatusVariants = cva("mt-1.5 flex items-center gap-x-1 text-xs", {
  variants: {
    status: {
      sent: "text-gray-500",
      failed: "text-red-500",
      pending: "text-gray-400",
    },
  },
  defaultVariants: {
    status: "sent",
  },
});

export interface ChatMessageProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof chatMessageVariants> {
  status?: "sent" | "failed" | "pending";
  statusText?: string;
  showStatus?: boolean;
}

const ChatMessage = React.forwardRef<HTMLLIElement, ChatMessageProps>(
  (
    {
      className,
      variant,
      status = "sent",
      statusText,
      showStatus = true,
      children,
      ...props
    },
    ref,
  ) => {
    const isUser = variant === "user";
    const defaultStatusText =
      status === "sent"
        ? "Sent"
        : status === "failed"
          ? "Not sent"
          : "Sending...";
    const finalStatusText = statusText || defaultStatusText;

    const statusIcon = React.useMemo(() => {
      switch (status) {
        case "sent":
          return <CheckCheck className="size-3 shrink-0" />;
        case "failed":
          return <AlertCircle className="size-3 shrink-0" />;
        case "pending":
          return <Loader2 className="size-3 shrink-0 animate-spin" />;
        default:
          return null;
      }
    }, [status]);

    if (isUser) {
      return (
        <li
          ref={ref}
          className={cn(chatMessageVariants({ variant }), className)}
          {...props}
        >
          <div className="grow space-y-3 text-end">
            <div className="inline-flex flex-col justify-end">
              <div
                className={cn(chatBubbleVariants({ variant }), "inline-block")}
              >
                {children}
              </div>
              {showStatus && (
                <span className={cn(chatStatusVariants({ status }), "ms-auto")}>
                  {statusIcon}
                  {finalStatusText}
                </span>
              )}
            </div>
          </div>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        className={cn(chatMessageVariants({ variant }), className)}
        {...props}
      >
        <div>
          <div className={cn(chatBubbleVariants({ variant }))}>{children}</div>
          {showStatus && (
            <span className={cn(chatStatusVariants({ status }))}>
              {statusIcon}
              {finalStatusText}
            </span>
          )}
        </div>
      </li>
    );
  },
);

ChatMessage.displayName = "ChatMessage";

const ChatMessageContent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("prose space-y-2 text-sm text-gray-800", className)}
    {...props}
  />
));
ChatMessageContent.displayName = "ChatMessageContent";

const ChatList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-5", className)} {...props} />
));
ChatList.displayName = "ChatList";

export { ChatMessage, ChatMessageContent, ChatList };
