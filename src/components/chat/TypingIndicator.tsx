"use client";

export function TypingIndicator() {
  return (
    <div className="relative rounded-2xl bg-muted/50 px-4 py-3 shadow-sm">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        AI is typing...
      </div>
    </div>
  );
}