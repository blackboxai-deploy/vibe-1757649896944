"use client";

import { MessageBubbleProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MessageBubble({ message, onCopy }: MessageBubbleProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // Simple success feedback without toast for now
      onCopy?.(message.content);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isUser = message.role === 'user';

  return (
    <div 
      className={cn(
        "flex w-full mb-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex items-start gap-3 max-w-[85%]", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground border"
        )}>
          {isUser ? 'U' : 'AI'}
        </div>

        {/* Message Content */}
        <div className={cn(
          "relative rounded-2xl px-4 py-3 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted/50 text-foreground",
          "message-bubble",
          isUser ? "user" : "assistant"
        )}>
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>

          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-right" : "text-left"
          )}>
            {formatTime(message.timestamp)}
          </div>

          {/* Message Actions */}
          <div className={cn(
            "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isUser ? "left-2" : "right-2",
            "message-actions"
          )}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-background/20"
              onClick={handleCopy}
              title="Copy message"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Typing Indicator (only for assistant messages that are being typed) */}
      {!isUser && message.isTyping && (
        <div className="typing-indicator ml-11">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      )}
    </div>
  );
}