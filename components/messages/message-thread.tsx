import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageThread as ThreadType, ThreadMessage } from '../../lib/client-messages-db';
import { useServiceRequest } from '../../components/service-request/service-request-context';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Avatar } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { 
  Send, Archive, ClipboardList, 
  Link2, Unlink 
} from 'lucide-react';

interface MessageThreadProps {
  thread: ThreadType;
  onReply: (threadId: string, message: string) => Promise<void>;
  onArchive: (threadId: string) => Promise<void>;
}

export function MessageThread({ thread, onReply, onArchive }: MessageThreadProps) {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchServiceRequestById, currentServiceRequest } = useServiceRequest();
  
  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(thread.id, replyText);
      setReplyText('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load the related service request
  React.useEffect(() => {
    if (thread.serviceRequestId) {
      fetchServiceRequestById(thread.serviceRequestId);
    }
  }, [thread.serviceRequestId, fetchServiceRequestById]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Conversation {thread.id.replace('thread-', '#')}
        </h2>
        <div className="flex gap-2">
          {thread.serviceRequestId && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 flex items-center gap-1">
              <ClipboardList className="h-3 w-3" />
              Linked to Ticket #{thread.serviceRequestId.replace('ticket-', '')}
            </Badge>
          )}
          <Button size="sm" variant="outline" onClick={() => onArchive(thread.id)}>
            <Archive className="h-4 w-4 mr-1" />
            {thread.isArchived ? 'Unarchive' : 'Archive'}
          </Button>
        </div>
      </div>
      
      {/* Related service request info */}
      {currentServiceRequest && (
        <div className="p-3 bg-purple-50 border-b flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-purple-800">Related Service Request: </span>
            <span className="text-sm">{currentServiceRequest.title}</span>
          </div>
          <Badge variant={currentServiceRequest.status === 'Resolved' ? 'success' : 'secondary'}>
            {currentServiceRequest.status}
          </Badge>
        </div>
      )}
      
      {/* Messages */}
      <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
        {thread.messages.map((message) => (
          <MessageThreadItem 
            key={message.id} 
            message={message} 
          />
        ))}
      </div>
      
      {/* Reply form */}
      {!thread.isArchived && (
        <div className="p-4 border-t">
          <div className="mb-2">
            <Textarea
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isSubmitting}
            >
              <Send className="h-4 w-4 mr-1" />
              Send Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MessageThreadItemProps {
  message: ThreadMessage;
}

export function MessageThreadItem({ message }: MessageThreadItemProps) {
  const isClient = message.sender === 'client';
  const formattedDate = format(new Date(message.timestamp), 'MMM d, h:mm a');
  
  return (
    <div className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isClient ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <div className={`h-full w-full rounded-full flex items-center justify-center text-xs text-white ${isClient ? 'bg-gray-600' : 'bg-blue-600'}`}>
              {isClient ? 'C' : 'S'}
            </div>
          </Avatar>
          <span className="font-medium text-sm">{message.senderName}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="whitespace-pre-line">
          {message.content}
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs font-medium mb-1">Attachments</p>
            {message.attachments.map((attachment, i) => (
              <div key={i} className="text-xs text-blue-600 underline">
                {attachment}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}