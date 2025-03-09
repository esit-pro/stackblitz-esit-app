import { useState, useEffect, useCallback } from 'react';
import { ClientMessage, clientMsgDb } from '../lib/client-messages-db';

export function useMessageDetail(messageId: string) {
  const [message, setMessage] = useState<ClientMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessage = useCallback(async () => {
    try {
      setLoading(true);
      const result = await clientMsgDb.getMessageById(messageId);
      setMessage(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch message'));
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    if (messageId) {
      fetchMessage();
    }
  }, [messageId, fetchMessage]);

  const markAsRead = useCallback(async () => {
    if (!message) return false;
    
    try {
      const success = await clientMsgDb.markMessageAsRead(messageId);
      if (success) {
        setMessage(prev => prev ? { ...prev, isRead: true } : null);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark message as read'));
      return false;
    }
  }, [messageId, message]);

  const flagMessage = useCallback(async (isFlagged: boolean) => {
    if (!message) return false;
    
    try {
      const success = await clientMsgDb.flagMessage(messageId, isFlagged);
      if (success) {
        setMessage(prev => prev ? { ...prev, isFlagged } : null);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to flag message'));
      return false;
    }
  }, [messageId, message]);

  const updateStatus = useCallback(async (status: ClientMessage['status']) => {
    if (!message) return false;
    
    try {
      const success = await clientMsgDb.updateMessageStatus(messageId, status);
      if (success) {
        setMessage(prev => prev ? { ...prev, status } : null);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update message status'));
      return false;
    }
  }, [messageId, message]);

  const refreshMessage = useCallback(() => {
    fetchMessage();
  }, [fetchMessage]);

  return {
    message,
    loading,
    error,
    markAsRead,
    flagMessage,
    updateStatus,
    refreshMessage,
  };
}