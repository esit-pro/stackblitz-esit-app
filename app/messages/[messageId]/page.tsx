
import { MessageDetail } from '@/components/messages/message-detail';
import { useClientMessages } from '@/hooks/use-client-messages';
import { notFound } from 'next/navigation';

export default function MessageDetailPage({
  params,
}: {
  params: { messageId: string };
}) {
  const { messages, markAsRead } = useClientMessages();
  const message = messages.find((msg) => msg.id === params.messageId);

  // If message not found, show 404
  if (!message) {
    // Using Next.js notFound function
    notFound();
  }

  // Mark message as read when viewing the detail
  if (!message.isRead) {
    markAsRead(message.id);
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <a
          href="/messages"
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all messages
        </a>
      </div>

      <MessageDetail message={message} />
    </div>
  );
}
