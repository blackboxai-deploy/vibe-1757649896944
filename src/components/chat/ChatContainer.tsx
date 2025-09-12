"use client";

import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function ChatContainer() {
  const { state, sendMessage, createNewSession, selectSession, deleteSession, clearHistory } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleToggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNewChat = () => {
    createNewSession();
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleCopyMessage = (content: string) => {
    // Message copy feedback could be added here
    console.log('Message copied:', content);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={handleToggleSidebar}
        sessions={state.sessions}
        currentSessionId={state.currentSession?.id || null}
        onSelectSession={handleSelectSession}
        onDeleteSession={deleteSession}
        onNewChat={handleNewChat}
        onClearHistory={clearHistory}
        isCollapsed={!isMobile && sidebarCollapsed}
      />

      {/* Main Chat Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && !sidebarCollapsed && "ml-[280px]",
          !isMobile && sidebarCollapsed && "ml-[60px]",
          isMobile && "ml-0"
        )}
      >
        {/* Mobile Header */}
        {isMobile && (
          <header className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-2 h-8 w-8"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            
            <h1 className="text-lg font-semibold">
              {state.currentSession?.title || 'ChatGPT Clone'}
            </h1>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="p-2 h-8 w-8"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </Button>
          </header>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={state.currentSession?.messages || []}
            isLoading={state.isLoading}
            onCopyMessage={handleCopyMessage}
          />
        </div>

        {/* Input Area */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={state.isLoading}
          placeholder="Type your message..."
        />
      </div>
    </div>
  );
}