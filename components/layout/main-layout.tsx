'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-background">
      <header className="px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-medium text-primary">ESIT Pro</h1>
        <ModeToggle />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={15}
            minSize={15}
            maxSize={20}
            collapsible={true}
            onCollapse={() => setIsSidebarCollapsed(true)}
            onExpand={() => setIsSidebarCollapsed(false)}
            className=""
          >
            <ScrollArea className="h-full">
              <div className="p-4">
                <Sidebar collapsed={isSidebarCollapsed} />
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="bg-accent/0 w-2 hover:bg-accent/40 active:bg-accent/40 transition-colors"
          />

          <ResizablePanel defaultSize={85} className="bg-transparent">
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
