import { ServiceRequestList } from '@/components/service-request/service-request-list';
import { ViewToggle } from '@/components/service-request/view-toggle';
import { MainLayout } from '@/components/layout/main-layout';
import { useState } from 'react';

export default function ServiceRequestsPage() {
  // Note: Since this is a Server Component by default, you would need to make this a Client Component
  // to use hooks like useState, or handle view toggling differently
  'use client';

  const [viewMode, setViewMode] = useState('list'); // "list" or "kanban"

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {viewMode === 'list' ? (
          <ServiceRequestList />
        ) : (
          <div className="mt-6">
            {/* Import and use your KanbanView component */}
            <KanbanView />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// For TypeScript, define the component in the same file
import { KanbanView } from '@/components/service-request/kanban-view';
