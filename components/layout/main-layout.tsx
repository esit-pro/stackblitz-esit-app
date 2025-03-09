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
    <div className="h-screen">
      <header className="border-b px-4 py-2 flex items-center align-right">
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
            className="bg-muted/50"
          >
            <ScrollArea className="h-full">
              <div className="p-4">
                <Sidebar collapsed={isSidebarCollapsed} />
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={85}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
