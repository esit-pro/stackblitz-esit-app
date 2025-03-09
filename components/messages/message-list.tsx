import React, { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ClientMessage } from '../../lib/client-messages-db';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Search, Flag, Archive, Inbox, 
  Mail, MailOpen, Filter, AlertCircle, 
  CheckCircle2, ClipboardList
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
}

export function MessageList({ messages, loading, unreadCount }: MessageListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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

  const handleViewMessage = (id: string) => {
    router.push(`/messages/${id}`);
  };

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

  if (loading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
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
      <div className="bg-gray-50 p-2 px-4 border-b flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'} 
          {unreadCount > 0 && ` (${unreadCount} unread)`}
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

      {/* Message list */}
      {filteredMessages.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No messages found matching your filters.
        </div>
      ) : (
        <ul className="divide-y">
          {filteredMessages.map((message) => (
            <li 
              key={message.id}
              className={`hover:bg-gray-50 transition-colors cursor-pointer ${!message.isRead ? 'bg-blue-50' : ''}`}
              onClick={() => handleViewMessage(message.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {message.subject}
                  </h3>
                  <div className="whitespace-nowrap text-sm text-gray-500 pl-2">
                    {format(new Date(message.received), 'MMM d, p')}
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      From: {message.clientName} &lt;{message.clientEmail}&gt;
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    {message.isFlagged && (
                      <Flag className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    {!message.isRead && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
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
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
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
    </div>
  );
}