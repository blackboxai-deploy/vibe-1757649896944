"use client";

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageInputProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MessageInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Type your message...",
  maxLength = 4000 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars <= 100;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className={cn(
          "relative flex items-end gap-3 rounded-2xl border transition-colors",
          "message-input-container",
          isOverLimit && "border-destructive"
        )}>
          {/* Text Area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              className={cn(
                "w-full p-4 pr-12 resize-none rounded-2xl",
                "message-input",
                "focus:outline-none focus:ring-0",
                "placeholder:text-muted-foreground",
                isOverLimit && "text-destructive"
              )}
              maxLength={maxLength + 100} // Allow slight overflow for better UX
              rows={1}
              disabled={isLoading}
            />

            {/* Character Counter */}
            {(isNearLimit || isOverLimit) && (
              <div className={cn(
                "absolute bottom-2 right-2 text-xs",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}>
                {remainingChars}
              </div>
            )}
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0 p-2">
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading || isOverLimit}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                "hover:scale-105 transition-transform duration-200"
              )}
              title={
                isLoading 
                  ? "Sending..." 
                  : !message.trim() 
                  ? "Type a message" 
                  : isOverLimit
                  ? "Message too long"
                  : "Send message (Enter)"
              }
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
          {!isNearLimit && !isOverLimit && (
            <p className="text-xs text-muted-foreground">
              {message.length} / {maxLength}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}