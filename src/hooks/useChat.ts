"use client";

import { useState, useCallback, useEffect } from 'react';
import { Message, ChatSession, ChatState } from '@/lib/types';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Generate session title from first message
const generateSessionTitle = (firstMessage: string) => {
  const words = firstMessage.trim().split(' ').slice(0, 6);
  return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
};

// Local storage keys
const STORAGE_KEYS = {
  SESSIONS: 'chatgpt-clone-sessions',
  CURRENT_SESSION: 'chatgpt-clone-current-session',
  SETTINGS: 'chatgpt-clone-settings'
};

export function useChat() {
  const [state, setState] = useState<ChatState>({
    currentSession: null,
    sessions: [],
    isLoading: false,
    error: null
  });

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const savedCurrentSessionId = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      
      if (savedSessions) {
        const sessions: ChatSession[] = JSON.parse(savedSessions).map((session: ChatSession & { createdAt: string; updatedAt: string; messages: Array<Message & { timestamp: string }> }) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: Message & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));

        const currentSession = savedCurrentSessionId 
          ? sessions.find(s => s.id === savedCurrentSessionId) || null
          : null;

        setState(prev => ({
          ...prev,
          sessions,
          currentSession
        }));
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = useCallback((sessions: ChatSession[], currentSessionId?: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      if (currentSessionId !== undefined) {
        if (currentSessionId) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, currentSessionId);
        } else {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        }
      }
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }, []);

  // Create new chat session
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setState(prev => {
      const newSessions = [newSession, ...prev.sessions];
      saveSessions(newSessions, newSession.id);
      return {
        ...prev,
        currentSession: newSession,
        sessions: newSessions
      };
    });

    return newSession.id;
  }, [saveSessions]);

  // Select existing session
  const selectSession = useCallback((sessionId: string) => {
    setState(prev => {
      const session = prev.sessions.find(s => s.id === sessionId);
      if (session) {
        saveSessions(prev.sessions, sessionId);
        return {
          ...prev,
          currentSession: session
        };
      }
      return prev;
    });
  }, [saveSessions]);

   // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

     // If no current session, create one first
    setState(prevState => {
      const currentSession = prevState.currentSession;
      
      if (!currentSession) {
        const newSession: ChatSession = {
          id: generateId(),
          title: generateSessionTitle(content),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const updatedSessions = [newSession, ...prevState.sessions];
        saveSessions(updatedSessions, newSession.id);
        
        return {
          ...prevState,
          currentSession: newSession,
          sessions: updatedSessions
        };
      }
      
      return prevState;
    });

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setState(prev => {
      if (!prev.currentSession) return prev;

      const updatedSession = {
        ...prev.currentSession,
        messages: [...prev.currentSession.messages, userMessage],
        title: prev.currentSession.messages.length === 0 
          ? generateSessionTitle(content) 
          : prev.currentSession.title,
        updatedAt: new Date()
      };

      const updatedSessions = prev.sessions.map(s => 
        s.id === updatedSession.id ? updatedSession : s
      );

      saveSessions(updatedSessions, updatedSession.id);

      return {
        ...prev,
        currentSession: updatedSession,
        sessions: updatedSessions
      };
    });

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        content: `This is a simulated response to: "${content}"\n\nThis ChatGPT clone is ready for customization! You can:\n\n• Replace this mock response with real API integration\n• Customize the UI theme and colors\n• Add new features like file uploads\n• Modify the message formatting\n• Add user authentication\n\nThe component architecture is modular and easy to extend.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setState(prev => {
        if (!prev.currentSession) return prev;

        const updatedSession = {
          ...prev.currentSession,
          messages: [...prev.currentSession.messages, assistantMessage],
          updatedAt: new Date()
        };

        const updatedSessions = prev.sessions.map(s => 
          s.id === updatedSession.id ? updatedSession : s
        );

        saveSessions(updatedSessions, updatedSession.id);

        return {
          ...prev,
          currentSession: updatedSession,
          sessions: updatedSessions,
          isLoading: false
        };
      });
    }, 1000 + Math.random() * 2000);

  }, [saveSessions]);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setState(prev => {
      const updatedSessions = prev.sessions.filter(s => s.id !== sessionId);
      const newCurrentSession = prev.currentSession?.id === sessionId 
        ? (updatedSessions[0] || null)
        : prev.currentSession;

      saveSessions(updatedSessions, newCurrentSession?.id || '');

      return {
        ...prev,
        sessions: updatedSessions,
        currentSession: newCurrentSession
      };
    });
  }, [saveSessions]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setState({
      currentSession: null,
      sessions: [],
      isLoading: false,
      error: null
    });
    saveSessions([], '');
  }, [saveSessions]);

  return {
    state,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    clearHistory
  };
}