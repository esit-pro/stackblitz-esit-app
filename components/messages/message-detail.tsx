import React from 'react';
import { format } from 'date-fns';
import { ClientMessage } from '../../lib/client-messages-db';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Archive, Flag, Trash, Reply, 
  CornerUpLeft, Star, AlertCircle, 
  Check, CheckCircle2, ClipboardList
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { MessageAttachments } from './message-attatchments';
import { MessageActions } from '../../components/messages/message-actions';

interface MessageDetailProps {
  message: ClientMessage;
  onBack: () => void;
}

export function MessageDetail({ message, onBack }: MessageDetailProps) {
  const formattedDate = format(new Date(message.received), 'PPP p');
  
  const getCategoryBadgeColor = (category?: string) => {
    switch (category) {
      case 'support':
        return 'bg-red-100 text-red-800';
      case 'inquiry':
        return 'bg-blue-100 text-blue-800';
      case 'feedback':
        return 'bg-green-100 text-green-800';
      case 'billing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-triage':
        return 'bg-yellow-100 text-yellow-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header with back button */}
      <div className="border-b p-4 flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <CornerUpLeft className="h-4 w-4" />
          Back to Messages
        </Button>
        <div className="space-x-2">
          {message.isFlagged && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Flag className="h-3 w-3 mr-1" /> Flagged
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={getCategoryBadgeColor(message.category)}
          >
            {message.category || 'Other'}
          </Badge>
          <Badge 
            variant="outline" 
            className={getStatusBadgeColor(message.status)}
          >
            {message.status}
          </Badge>
        </div>
      </div>

      {/* Message header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold mb-2">{message.subject}</h1>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <p className="text-gray-600">
              From: <span className="font-medium">{message.clientName}</span> &lt;{message.clientEmail}&gt;
            </p>
            <p className="text-gray-500 text-sm">Received: {formattedDate}</p>
          </div>
          {message.relatedServiceId && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
              <ClipboardList className="h-3 w-3 mr-1" />
              Related to Service Request #{message.relatedServiceId.replace('ticket-', '')}
            </Badge>
          )}
        </div>
      </div>

      {/* Message content */}
      <Tabs defaultValue="message" className="w-full">
        <div className="border-b px-6">
          <TabsList>
            <TabsTrigger value="message">Message</TabsTrigger>
            {message.attachments && message.attachments.length > 0 && (
              <TabsTrigger value="attachments">
                Attachments ({message.attachments.length})
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="message" className="p-6">
          <div className="prose max-w-none whitespace-pre-line">
            {message.content}
          </div>
        </TabsContent>

        {message.attachments && message.attachments.length > 0 && (
          <TabsContent value="attachments" className="p-6">
            <MessageAttachments attachments={message.attachments} />
          </TabsContent>
        )}
      </Tabs>

      {/* Actions footer */}
      <MessageActions message={message} />
    </div>
  );
}