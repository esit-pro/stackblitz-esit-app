'use client'

import { useRouter } from 'next/navigation';
import { useClientMessages, ClientMessage } from '@/hooks/use-client-messages';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function ClientMessageList() {
  const { messages, markAsRead, toggleFlag } = useClientMessages();
  const router = useRouter();

  // Handle message selection
  const handleSelectMessage = (message: ClientMessage) => {
    // Navigate to message detail page
    router.push(`/messages/${message.id}`);
  };

  // Sort messages by received date (newest first)
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.received).getTime() - new Date(a.received).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Client Messages</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="divide-y">
        {sortedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 p-4 ${
              message.isRead ? 'bg-background' : 'bg-muted/30'
            } hover:bg-muted transition-colors`}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  message.clientName
                )}`}
              />
              <AvatarFallback>
                {message.clientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handleSelectMessage(message)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-medium truncate ${
                        !message.isRead ? 'font-semibold' : ''
                      }`}
                    >
                      {message.clientName}
                    </h3>
                    {message.isFlagged && (
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
                        className="text-amber-500"
                      >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
                      </svg>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {message.clientEmail}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(message.received), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="mt-1">
                <h4
                  className={`text-sm truncate ${
                    !message.isRead ? 'font-semibold' : ''
                  }`}
                >
                  {message.subject}
                </h4>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {message.content}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {message.category && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {message.category}
                  </Badge>
                )}
                <Badge
                  variant={
                    message.status === 'new' ? 'destructive' : 'secondary'
                  }
                  className="text-xs capitalize"
                >
                  {message.status}
                </Badge>
                {message.attachments && message.attachments.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                    {message.attachments.length}
                  </Badge>
                )}
              </div>
            </div>

            <button
              className="ml-2 p-1 rounded-full hover:bg-muted-foreground/10"
              onClick={(e) => {
                e.stopPropagation();
                toggleFlag(message.id);
              }}
              title={message.isFlagged ? 'Unflag message' : 'Flag message'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={message.isFlagged ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  message.isFlagged ? 'text-amber-500' : 'text-muted-foreground'
                }
              >
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
