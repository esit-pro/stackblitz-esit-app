import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '../../lib/client-messages-db';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { 
  Search, Flag, Archive, Inbox, 
  Mail, MailOpen, Filter, AlertCircle, 
  CheckCircle2, ClipboardList,
  X, User, Calendar, Paperclip
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface MessageListProps {
  messages: ClientMessage[];
  loading: boolean;
  unreadCount: number;
  selectedMessages: string[];
  onToggleSelect: (id: string) => void;
  onClearSelection: () => void;
}

// Utility function to get badge color for categories
const getCategoryBadgeColor = (category?: string) => {
  switch (category) {
    case 'support':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'inquiry':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'feedback':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'billing':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

// Message details component that shows the full message content
interface MessageDetailsProps {
  message: ClientMessage | null;
  onClose: () => void;
}

// Define the component before it's used
const MessageDetails: React.FC<MessageDetailsProps> = ({ message, onClose }) => {
  // If message is null, don't render anything
  if (!message) return null;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{message.subject}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Message meta data */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">From:</span> {message.clientName} &lt;{message.clientEmail}&gt;
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Received:</span> {format(new Date(message.received), 'PPpp')}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {message.category && (
              <Badge variant="secondary" className={getCategoryBadgeColor(message.category)}>
                {message.category}
              </Badge>
            )}
            {message.status && (
              <Badge variant="outline">
                {message.status}
              </Badge>
            )}
            {message.relatedServiceId && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <ClipboardList className="h-3 w-3 mr-1" />
                Ticket #{message.relatedServiceId.replace('ticket-', '')}
              </Badge>
            )}
          </div>
        </div>

        {/* Message content */}
        <div className="prose max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Attachments ({message.attachments.length})</h3>
            <div className="space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center p-2 border rounded-md">
                  <Paperclip className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            <Button variant="outline" size="sm" className="mr-2">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="h-4 w-4 mr-2" />
              {message.isFlagged ? 'Unflag' : 'Flag'}
            </Button>
          </div>
          <Button variant="default" size="sm">
            <ClipboardList className="h-4 w-4 mr-2" />
            Convert to Service Request
          </Button>
        </div>
      </div>
    </div>
  );
}


export function MessageList({ messages, loading, unreadCount, selectedMessages, onToggleSelect, onClearSelection }: MessageListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentMessage, setCurrentMessage] = useState<ClientMessage | null>(null);

  // Apply filters
  const filteredMessages = messages.filter(message => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewMessage = (message: ClientMessage) => {
    // If the same message is clicked again, close the detail view
    if (currentMessage && currentMessage.id === message.id) {
      setCurrentMessage(null);
    } else {
      setCurrentMessage(message);
    }
  };

  // Other methods and state handlers

  if (loading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  return (
    <div className="bg-background shadow rounded-lg overflow-hidden border h-full flex flex-col">
      {/* Header with filters */}
      <div className="p-4 border-b flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-triage">In Triage</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="inquiry">Inquiry</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-muted/50 p-2 px-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'} 
            {unreadCount > 0 && ` (${unreadCount} unread)`}
          </div>
          {selectedMessages.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedMessages.length} selected
              <Button 
                size="sm" 
                variant="ghost" 
                className="ml-2 text-xs"
                onClick={onClearSelection}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="text-xs">
            <Inbox className="h-3 w-3 mr-1" /> Inbox
          </Button>
          <Button size="sm" variant="ghost" className="text-xs">
            <Flag className="h-3 w-3 mr-1" /> Flagged
          </Button>
          <Button size="sm" variant="ghost" className="text-xs">
            <Archive className="h-3 w-3 mr-1" /> Archived
          </Button>
        </div>
      </div>

      {/* Main content area with list and details pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Message list container - transitions width using CSS */}
        <div 
          className={`p-4 rounded-xl ${currentMessage ? 'w-[60%]' : 'w-full'} transition-all duration-300 ease-in-out`}
        >
          <ScrollArea className="h-full border-r">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No messages found matching your filters.
              </div>
            ) : (
              <ul className="divide-y">
          {filteredMessages.map((message) => (
            <li 
              key={message.id}
              className={`hover:bg-muted/50 transition-colors cursor-pointer`}
              onClick={(e) => {
                if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
                  onToggleSelect(message.id);
                } else {
                  handleViewMessage(message);
                }
              }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base text-foreground ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {message.subject}
                  </h3>
                  <div className="whitespace-nowrap text-sm text-muted-foreground pl-2">
                    {format(new Date(message.received), 'MMM d, p')}
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      From: {message.clientName} &lt;{message.clientEmail}&gt;
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                <input
                  type="checkbox"
                  checked={selectedMessages.includes(message.id)}
                  onChange={(e) => e.stopPropagation()}
                  className="rounded border-primary/20 text-primary focus:ring-primary/30"
                />
                    {message.isFlagged && (
                      <Flag className="h-4 w-4 text-yellow-500 fill-yellow-500 dark:text-yellow-400 dark:fill-yellow-400" />
                    )}
                    {!message.isRead && (
                      <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.category && (
                    <Badge variant="secondary" className={getCategoryBadgeColor(message.category)}>
                      {message.category}
                    </Badge>
                  )}
                  {message.relatedServiceId && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <ClipboardList className="h-3 w-3 mr-1" />
                      Ticket #{message.relatedServiceId.replace('ticket-', '')}
                    </Badge>
                  )}
                  {message.attachments && message.attachments.length > 0 && (
                    <Badge variant="outline">
                      {message.attachments.length} {message.attachments.length === 1 ? 'attachment' : 'attachments'}
                    </Badge>
                  )}
                </div>
              </div>
            </li>
              ))}
            </ul>
            )}
          </ScrollArea>
        </div>
        
        {/* Message details pane - slides in when a message is selected */}
        <div 
          className={`w-[40%] min-w-[350px] overflow-auto border-l transform transition-all duration-300 ease-in-out ${currentMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none absolute right-0'}`}
        >
              {currentMessage && <MessageDetails message={currentMessage} onClose={() => setCurrentMessage(null)} />}
        </div>
      </div>
    </div>
  );
}