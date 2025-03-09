import { useState, useEffect, useCallback } from 'react';
import { ClientMessage, clientMsgDb } from '../lib/client-messages-db';
const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

export function useClientMessages() {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);



  const fetchMessages = useCallback(async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      const result = await clientMsgDb.getClientMessages(page, limit);
      setMessages(result.messages);
      
      // Get unread count
      const count = await clientMsgDb.getUnreadMessageCount();
      setUnreadCount(count);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const success = await clientMsgDb.markMessageAsRead(id, 'assignedTo', assignedTo );
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, isRead: true } : msg
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark message as read'));
      return false;
    }
  }, []);

  const flagMessage = useCallback(async (id: string, isFlagged: boolean) => {
    try {
      const success = await clientMsgDb.flagMessage(id, isFlagged);
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, isFlagged } : msg
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to flag message'));
      return false;
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: ClientMessage['status']) => {
    try {
      const success = await clientMsgDb.updateMessageStatus(id, status);
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, status } : msg
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update message status'));
      return false;
    }
  }, []);

  const assignMessage = useCallback(async (id: string, assignedTo: string) => {
    try {
      const success = await clientMsgDb.assignMessage(id, assignedTo);
      if (success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, assignedTo } : msg
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to assign message'));
      return false;
    }
  }, []);

  const refreshMessages = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    unreadCount,
    markAsRead,
    flagMessage,
    updateStatus,
    assignMessage,
    refreshMessages,
  };
}