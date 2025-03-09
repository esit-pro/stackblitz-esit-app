"use client";

import { ServiceRequestList } from '@/components/service-request/service-request-list';
import { ViewToggle } from '@/components/service-request/view-toggle';

import { useState, useEffect } from 'react';
import { KanbanView } from '@/components/service-request/kanban-view';
import { Item } from '@/lib/db';
import { ServiceRequestProvider } from '@/components/service-request/service-request-context';

// The actual content component that will be wrapped with the provider
function ServiceRequestsContent() {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list'); // "list" or "kanban"
  const [serviceRequests, setServiceRequests] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch service requests
  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/service-requests');
      const data = await response.json();
      setServiceRequests(data);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const handleItemSelect = (item: Item) => {
    setSelectedItemId(item.id);
  };

  const handleUpdateStatus = async (id: string, status: string): Promise<void> => {
    try {
      const response = await fetch(`/api/service-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        // Refresh the list after successful update
        fetchServiceRequests();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <ViewToggle view={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === 'list' ? (
        <ServiceRequestList />
      ) : (
        <div className="mt-6">
          <KanbanView 
            items={serviceRequests}
            onItemSelect={handleItemSelect}
            selectedItemId={selectedItemId}
            onItemMove={(result, items) => {
              // Update item status based on the column it was moved to
              if (
                result.destination && 
                result.source.droppableId !== result.destination.droppableId
              ) {
                const itemId = result.draggableId;
                const newStatus = result.destination.droppableId;
                
                // Map column ID back to status name
                const statusMap: Record<string, string> = {
                  'new': 'New',
                  'in-progress': 'In Progress',
                  'waiting-on-client': 'Waiting on Client',
                  'resolved': 'Resolved'
                };
                
                const formattedStatus = statusMap[newStatus] || 'New';
                handleUpdateStatus(itemId, formattedStatus);
              }
              return items; // Return items unchanged as we'll refresh from API
            }}
          />
        </div>
      )}
    </div>
  );
}

// Export the page component wrapped with the provider
export default function ServiceRequestsPage() {
  return (
    <ServiceRequestProvider>
      <ServiceRequestsContent />
    </ServiceRequestProvider>
  );
}