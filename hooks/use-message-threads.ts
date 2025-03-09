// hooks/use-message-threads.ts
import { useState, useEffect, useCallback } from 'react';
import { MessageThread, ThreadMessage, clientMsgDb } from '../lib/client-messages-db';

export function useMessageThreads() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchThreads = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const result = await clientMsgDb.getThreads(page, limit);
      setThreads(result.threads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch message threads'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const getThreadById = useCallback(async (id: string) => {
    try {
      return await clientMsgDb.getThreadById(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get thread'));
      return null;
    }
  }, []);

  const markMessageAsRead = useCallback(async (threadId: string, messageId: string) => {
    try {
      const success = await clientMsgDb.markThreadMessageAsRead(threadId, messageId);
      if (success) {
        setThreads(prev => 
          prev.map(thread => 
            thread.id === threadId 
              ? {
                  ...thread,
                  messages: thread.messages.map(msg => 
                    msg.id === messageId ? { ...msg, isRead: true } : msg
                  )
                }
              : thread
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark thread message as read'));
      return false;
    }
  }, []);

  const addMessageToThread = useCallback(async (threadId: string, message: Omit<ThreadMessage, 'id'>) => {
    try {
      const newMessageId = await clientMsgDb.addMessageToThread(threadId, message);
      if (newMessageId) {
        setThreads(prev => 
          prev.map(thread => 
            thread.id === threadId 
              ? {
                  ...thread,
                  messages: [
                    ...thread.messages,
                    { ...message, id: newMessageId }
                  ]
                }
              : thread
          )
        );
      }
      return newMessageId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add message to thread'));
      return null;
    }
  }, []);

  const createNewThread = useCallback(async (initialMessage: Omit<ThreadMessage, 'id'>, serviceRequestId?: string) => {
    try {
      const newThreadId = await clientMsgDb.createNewThread(initialMessage, serviceRequestId);
      // Refresh threads to include the new one
      fetchThreads();
      return newThreadId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create new thread'));
      return null;
    }
  }, [fetchThreads]);

  const archiveThread = useCallback(async (threadId: string, isArchived: boolean) => {
    try {
      const success = await clientMsgDb.archiveThread(threadId, isArchived);
      if (success) {
        setThreads(prev => 
          prev.map(thread => 
            thread.id === threadId ? { ...thread, isArchived } : thread
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to archive thread'));
      return false;
    }
  }, []);

  const refreshThreads = useCallback(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    getThreadById,
    markMessageAsRead,
    addMessageToThread,
    createNewThread,
    archiveThread,
    refreshThreads,
  };
}