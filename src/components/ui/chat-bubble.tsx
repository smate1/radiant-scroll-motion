"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageLoading } from "@/components/ui/message-loading";

interface ChatBubbleProps {
  variant?: "sent" | "received"
  layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
}

export function ChatBubble({
  variant = "received",
  layout = "default",
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      data-chat-bubble
      className={cn(
        "flex items-start gap-3 mb-6",
        variant === "sent" && "flex-row-reverse",
        className,
      )}
    >
      {children}
    </div>
  )
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received"
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ChatBubbleMessage({
  variant = "received",
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Helper function to format text content
  const formatContent = (content: any) => {
    if (typeof content !== 'string') return content;

    // Split content into paragraphs and format
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }

      // Check if line starts with a number (like "1.", "2.", etc.)
      const isNumberedItem = /^\d+\./.test(line.trim());
      const isBulletItem = line.trim().startsWith('- ') || line.trim().startsWith('• ');

      if (isNumberedItem || isBulletItem) {
        return (
          <div key={index} className="mb-2 pl-2">
            {line.trim()}
          </div>
        );
      }

      // Check if it's a heading (starts with **text**)
      const headingMatch = line.match(/^\*\*(.*?)\*\*/);
      if (headingMatch) {
        return (
          <div key={index} className="font-semibold mb-2 mt-3">
            {headingMatch[1]}
          </div>
        );
      }

      return (
        <div key={index} className="mb-2">
          {line.trim()}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3",
        // Dynamic max-width based on device type
        isMobile ? "max-w-[85%]" : "max-w-[80%]",
        // Enhanced mobile optimizations
        isMobile && "chat-bubble-mobile",
        variant === "sent"
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-700 text-gray-100",
        className
      )}
      style={{
        // Ensure no overflow scroll on individual messages
        overflow: 'visible',
        maxHeight: 'none',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        <div
          className={cn(
            "text-sm leading-relaxed",
            "chat-bubble-message-content"
          )}
          style={{
            // Force proper text wrapping without scroll
            overflow: 'visible',
            maxHeight: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {formatContent(children)}
        </div>
      )}
    </div>
  )
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

export function ChatBubbleAvatar({
  src,
  fallback = "AI",
  className,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0 border-none outline-none", className)} style={{ border: 'none', outline: 'none' }}>
      {src && <AvatarImage src={src} className="border-none outline-none" style={{ border: 'none', outline: 'none' }} />}
      <AvatarFallback className="text-xs bg-gray-600 text-gray-200 border-none outline-none" style={{ border: 'none', outline: 'none' }}>{fallback}</AvatarFallback>
    </Avatar>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ChatBubbleAction({
  icon,
  onClick,
  className,
}: ChatBubbleActionProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-6 w-6", className)}
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

export function ChatBubbleActionWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex items-center gap-1 mt-2", className)}>
      {children}
    </div>
  )
}
