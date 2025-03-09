'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientMessage } from '@/models/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientMessageList } from '@/components/messages/client-message-list';
import { MessageDetail } from '@/components/messages/message-detail';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from '@/components/ui/resizable';

export function TriagePanel() {
  const [selectedMessage, setSelectedMessage] = useState<ClientMessage | null>(
    null
  );

  const handleMessageSelect = (message: ClientMessage) => {
    setSelectedMessage(message);
  };

  const handleBack = () => {
    setSelectedMessage(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    // In a real app, this would navigate to the previous or next message
    console.log(`Navigate ${direction}`);
  };

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={selectedMessage ? 40 : 100} minSize={30}>
          <ClientMessageList
            onSelectMessage={handleMessageSelect}
            selectedMessageId={selectedMessage?.id}
          />
        </ResizablePanel>

        {selectedMessage && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={40}>
              <MessageDetail
                message={selectedMessage}
                onBack={handleBack}
                onNavigate={handleNavigate}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
