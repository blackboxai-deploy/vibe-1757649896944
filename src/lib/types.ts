// Core chat types and interfaces

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface ChatSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  messageAnimation: boolean;
  soundEnabled: boolean;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
  onCopy?: (content: string) => void;
}

export interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => void;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearHistory: () => void;
}