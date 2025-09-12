"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NewChatButtonProps {
  onClick: () => void;
  isCollapsed?: boolean;
}

export function NewChatButton({ onClick, isCollapsed = false }: NewChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "w-full justify-start gap-3 h-12 text-left font-normal",
        "hover:bg-accent hover:text-accent-foreground",
        "border border-border/50 hover:border-border",
        "transition-all duration-200",
        isCollapsed && "justify-center px-0"
      )}
      variant="outline"
    >
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      {!isCollapsed && (
        <span>New Chat</span>
      )}
    </Button>
  );
}