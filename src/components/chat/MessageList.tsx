"use client";

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onCopyMessage?: (content: string) => void;
}

export function MessageList({ messages, isLoading = false, onCopyMessage }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyMessage = (content: string) => {
    onCopyMessage?.(content);
  };

  return (
    <div className="flex-1 relative">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="chat-messages p-4 pb-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Welcome to ChatGPT Clone
                  </h3>
                  <p className="text-muted-foreground">
                    Start a conversation by typing a message below. This interface is fully customizable and ready for your own AI integration.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Responsive design for all devices
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Dark and light theme support
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Conversation history management
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Easy customization and theming
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              onCopy={handleCopyMessage}
            />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground border flex items-center justify-center text-sm font-medium">
                AI
              </div>
              <TypingIndicator />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} className="h-1" />
        </div>
      </ScrollArea>
    </div>
  );
}