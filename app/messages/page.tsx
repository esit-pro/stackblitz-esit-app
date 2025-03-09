"use client";

import { useState } from 'react';
import { useClientMessages } from '../../hooks/use-client-messages';
import { MessageList } from '../../components/messages/client-message-list';
import { ThreadList } from '../../components/messages/thread-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { useMessageThreads } from '../../hooks/use-message-threads';
import { 
  Inbox, 
  MessageSquare, 
  RefreshCcw,
  Archive, 
  Trash2
} from 'lucide-react';

export default function MessagesPage() {
  const { 
    messages, 
    loading, 
    unreadCount, 
    refreshMessages,
    archiveMessages,
    deleteMessages,
    selectedMessages,
    toggleMessageSelection,
    clearSelection
  } = useClientMessages();
  
  const { 
    threads, 
    loading: threadsLoading, 
    refreshThreads 
  } = useMessageThreads();
  
  const [activeTab, setActiveTab] = useState<string>('inbox');
  
  const handleRefresh = () => {
    if (activeTab === 'inbox') {
      refreshMessages();
    } else {
      refreshThreads();
    }
  };
  
  const handleArchiveSelected = async () => {
    if (selectedMessages.length > 0) {
      await archiveMessages(selectedMessages);
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedMessages.length > 0) {
      await deleteMessages(selectedMessages);
    }
  }

  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Messages & Communication</h1>
        
          <div className="flex gap-2">
            {selectedMessages.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleArchiveSelected}
                className="gap-1"
              >
                <Archive className="h-4 w-4" />
                Archive ({selectedMessages.length})
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
                className="gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedMessages.length})
              </Button>
            </>
            )}
            <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
            </Button>
          </div>
        </div>
      
        <Tabs defaultValue="inbox" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inbox" className="gap-1">
              <Inbox className="h-4 w-4" />
              Inbox
              {unreadCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="threads" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              Conversations
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="inbox">
            <MessageList 
            messages={messages} 
            loading={loading} 
            unreadCount={unreadCount}
            selectedMessages={selectedMessages}
            onToggleSelect={toggleMessageSelection}
            onClearSelection={clearSelection}
            />
          </TabsContent>
          
          <TabsContent value="threads">
            <ThreadList 
              threads={threads} 
              loading={threadsLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}