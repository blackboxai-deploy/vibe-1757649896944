"use client";

import { useState } from 'react';
import { ChatSession } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isCollapsed?: boolean;
}

export function ChatHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  isCollapsed = false
}: ChatHistoryProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          {!isCollapsed && (
            <>
              <div className="text-sm">No conversations yet</div>
              <div className="text-xs mt-1">Start a new chat to begin</div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-2">
      <div className="space-y-1 py-2">
        {sessions.map((session) => {
          const isActive = session.id === currentSessionId;
          
          return (
            <div
              key={session.id}
              className="relative group"
              onMouseEnter={() => setHoveredSession(session.id)}
              onMouseLeave={() => setHoveredSession(null)}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 font-normal text-left",
                  "hover:bg-accent/50 rounded-lg transition-all duration-200",
                  "chat-history-item",
                  isActive && "bg-accent text-accent-foreground active",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => onSelectSession(session.id)}
              >
                {/* Chat Icon */}
                <div className="flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-muted-foreground"
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

                {/* Chat Details */}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {truncateTitle(session.title)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(session.updatedAt)} • {session.messages.length} messages
                    </div>
                  </div>
                )}
              </Button>

              {/* Delete Button */}
              {!isCollapsed && hoveredSession === session.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteSession(session.id)}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}