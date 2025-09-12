"use client";

import { ChatSession } from '@/lib/types';
import { ChatHistory } from './ChatHistory';
import { NewChatButton } from './NewChatButton';
import { UserProfile } from './UserProfile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({
  isOpen,
  onToggle,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  onClearHistory,
  isCollapsed = false
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-background border-r border-border",
          "flex flex-col transition-all duration-300 ease-in-out",
          "chat-sidebar",
          isCollapsed && "collapsed",
          !isOpen && "mobile-hidden lg:translate-x-0",
          isOpen && "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-foreground">
              ChatGPT Clone
            </h1>
          )}
          
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1.5 h-8 w-8 hover:bg-accent"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 border-b border-border">
          <NewChatButton onClick={onNewChat} isCollapsed={isCollapsed} />
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <ChatHistory
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* User Profile */}
        <UserProfile onClearHistory={onClearHistory} isCollapsed={isCollapsed} />
      </aside>
    </>
  );
}