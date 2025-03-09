"use client";

import { MessageDetail } from '@/components/messages/message-detail';
import { useClientMessages } from '@/hooks/use-client-messages';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessageDetailPage({
  params,
}: {
  params: { messageId: string };
}) {
  const router = useRouter();
  const { messages, markAsRead } = useClientMessages();
  const message = messages.find((msg) => msg.id === params.messageId);

  // If message not found, redirect to messages list
  useEffect(() => {
    if (!message) {
      router.push('/messages');
    }
  }, [message, router]);

  // Mark message as read when viewing the detail
  useEffect(() => {
    if (message && !message.isRead) {
      markAsRead(message.id);
    }
  }, [message, markAsRead]);

  // Handle navigation back to message list
  const handleBack = () => {
    router.push('/messages');
  };

  if (!message) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <MessageDetail 
        message={message} 
        onBack={handleBack}
      />
    </div>
  );
}