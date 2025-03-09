"use client";

import { useState, useCallback, useEffect } from 'react';
import { ClientMessage, MessageThread, ThreadMessage } from '@/lib/db';
import { db } from '@/lib/db';

// Define the interface for what the hook returns
export interface ClientMessagesHook {
  messages: ClientMessage[];
  loading: boolean;
  markAsRead: (messageId: string) => Promise<void>;
  updateStatus: (messageId: string, status: ClientMessage['status']) => Promise<void>;
  toggleFlag: (messageId: string) => Promise<void>;
  getMessageThread: (messageId: string) => Promise<MessageThread | null>;
  sendReply: (messageId: string, content: string, attachments?: string[]) => Promise<void>;
  createServiceRequest: (messageIds: string[], serviceRequestData: any) => Promise<any>;
  flagMessage: (messageId: string, isFlagged: boolean) => Promise<void>;
  archiveMessages: (messageIds: string[]) => Promise<void>;
  deleteMessages: (messageIds: string[]) => Promise<void>;
}

export function useClientMessages(): ClientMessagesHook {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [threads, setThreads] = useState<Record<string, MessageThread>>({});

  // Load messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const fetchedMessages = await db.getMessages();
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Mark a message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const updatedMessage = await db.updateMessage(messageId, { isRead: true });
      if (updatedMessage) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, []);

  // Update a message's status
  const updateStatus = useCallback(async (messageId: string, status: ClientMessage['status']) => {
    try {
      const updatedMessage = await db.updateMessage(messageId, { status });
      if (updatedMessage) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, status } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }, []);

  // Toggle flag status
  const toggleFlag = useCallback(async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const isFlagged = !message.isFlagged;
      const updatedMessage = await db.updateMessage(messageId, { isFlagged });
      
      if (updatedMessage) {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, isFlagged } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error toggling flag:', error);
    }
  }, [messages]);

  // Get a message thread
  const getMessageThread = useCallback(async (messageId: string): Promise<MessageThread | null> => {
    try {
      const thread = await db.getThread(messageId);
      if (thread) {
        // Cache the thread locally
        setThreads(prev => ({
          ...prev,
          [messageId]: thread
        }));
      }
      return thread;
    } catch (error) {
      console.error('Error getting message thread:', error);
      return null;
    }
  }, []);

  // Send a reply to a message
  const sendReply = useCallback(async (messageId: string, content: string, attachments?: string[]) => {
    try {
      const reply: Omit<ThreadMessage, 'id' | 'timestamp'> = {
        sender: 'provider',
        senderName: 'Support Agent',
        content,
        attachments,
        isRead: true,
      };
      
      const updatedThread = await db.addReplyToThread(messageId, reply);
      
      if (updatedThread) {
        setThreads(prev => ({
          ...prev,
          [messageId]: updatedThread
        }));
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }, []);

  // Create a service request from message(s)
  const createServiceRequest = useCallback(async (messageIds: string[], serviceRequestData: any) => {
    try {
      const serviceRequest = await db.createServiceRequest(messageIds, {
        title: serviceRequestData.title,
        category: serviceRequestData.category,
        priority: serviceRequestData.priority,
        tags: serviceRequestData.tags || [],
      });
      
      if (serviceRequest) {
        // Update local state to reflect the conversion
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            messageIds.includes(msg.id)
              ? { ...msg, status: 'converted', relatedServiceId: serviceRequest.id }
              : msg
          )
        );
      }
      
      return serviceRequest;
    } catch (error) {
      console.error('Error creating service request:', error);
      return null;
    }
  }, []);

  // Flag a message (using toggle flag internally)
  const flagMessage = useCallback(async (messageId: string, isFlagged: boolean) => {
    await toggleFlag(messageId);
  }, [toggleFlag]);

  // Archive messages
  const archiveMessages = useCallback(async (messageIds: string[]) => {
    try {
      const updatePromises = messageIds.map(id => 
        db.updateMessage(id, { status: 'archived' })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, status: 'archived' } : msg
        )
      );
    } catch (error) {
      console.error('Error archiving messages:', error);
    }
  }, []);

  // Delete messages
  const deleteMessages = useCallback(async (messageIds: string[]) => {
    try {
      const updatePromises = messageIds.map(id => 
        db.updateMessage(id, { status: 'deleted' })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, status: 'deleted' } : msg
        )
      );
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  }, []);

  return {
    messages,
    loading,
    markAsRead,
    updateStatus,
    toggleFlag,
    getMessageThread,
    sendReply,
    createServiceRequest,
    flagMessage,
    archiveMessages,
    deleteMessages,
  };
}