import React from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MessageThread } from '../../lib/client-messages-db';
import { Badge } from '../../components/ui/badge';
import {
  Archive, MessageSquare, Clock,
  CheckCircle2, ClipboardList, UserCircle
} from 'lucide-react';

interface ThreadListProps {
  threads: MessageThread[];
  loading: boolean;
}

export function ThreadList({ threads, loading }: ThreadListProps) {
  const router = useRouter();
  
  const handleViewThread = (id: string) => {
    router.push(`/messages/threads/${id}`);
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading threads...</div>;
  }
  
  if (threads.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
        No message threads found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Message Threads</h2>
      </div>
      
      <ul className="divide-y">
        {threads.map((thread) => {
          const lastMessage = thread.messages[thread.messages.length - 1];
          const hasUnread = thread.messages.some(msg => !msg.isRead && msg.sender === 'client');
          const formattedDate = format(new Date(lastMessage.timestamp), 'MMM d, p');
          
          return (
            <li 
              key={thread.id}
              className={`hover:bg-gray-50 transition-colors cursor-pointer p-4 ${hasUnread ? 'bg-blue-50' : ''} ${thread.isArchived ? 'opacity-75' : ''}`}
              onClick={() => handleViewThread(thread.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-5 w-5 ${hasUnread ? 'text-blue-500' : 'text-gray-400'}`} />
                  <h3 className="font-medium">
                    Thread {thread.id.replace('thread-', '#')}
                  </h3>
                  {hasUnread && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      New messages
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formattedDate}
                </div>
              </div>
              
              <div className="pl-7">
                <p className="text-sm mb-1 line-clamp-1">
                  <span className="font-medium">{lastMessage.senderName}: </span>
                  {lastMessage.content}
                </p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {thread.serviceRequestId && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 flex items-center gap-1">
                      <ClipboardList className="h-3 w-3" />
                      Ticket #{thread.serviceRequestId.replace('ticket-', '')}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    <UserCircle className="h-3 w-3" />
                    {thread.messages.length} {thread.messages.length === 1 ? 'message' : 'messages'}
                  </Badge>
                  
                  {thread.isArchived && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Archive className="h-3 w-3" />
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}