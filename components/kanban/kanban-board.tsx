"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';
import { KanbanColumnAddButton } from './kanban-column-add';
import { Item as ServiceRequest } from '@/lib/db';
import { useServiceRequest } from '@/components/service-request/service-request-context';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw } from 'lucide-react';

interface KanbanBoardProps {
  serviceRequests: ServiceRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onRefresh: () => void;
}

// Define the possible columns for the board with theme compatibility
const defaultColumns = [
  { id: 'new', title: 'New', color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800' },
  { id: 'waiting-on-client', title: 'Waiting on Client', color: 'bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800' },
  { id: 'resolved', title: 'Resolved', color: 'bg-green-50 border-green-200 dark:bg-green-950/40 dark:border-green-800' },
];

// Mapping from your data model status to our column IDs
const statusToColumnMapping: Record<string, string> = {
  'New': 'new',
  'In Progress': 'in-progress',
  'Waiting on Client': 'waiting-on-client',
  'Resolved': 'resolved',
};

// Mapping from column IDs back to your data model status
const columnToStatusMapping: Record<string, string> = {
  'new': 'New',
  'in-progress': 'In Progress',
  'waiting-on-client': 'Waiting on Client',
  'resolved': 'Resolved',
};

export function KanbanBoard({ serviceRequests, loading, onUpdateStatus, onRefresh }: KanbanBoardProps) {
  const [columns, setColumns] = useState(defaultColumns);
  const [activeCard, setActiveCard] = useState<ServiceRequest | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  
  // Group service requests by status
  const getColumnCards = (columnId: string) => {
    return serviceRequests.filter(request => {
      // Map the request status to our column ID
      const mappedColumnId = statusToColumnMapping[request.status || ''] || 'new';
      return mappedColumnId === columnId;
    });
  };

  // Set up drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    })
  );

  // Handle start of dragging
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedItem = serviceRequests.find(item => item.id === active.id);
    if (draggedItem) {
      setActiveCard(draggedItem);
      setDraggingCardId(draggedItem.id);
    }
  };

  // Handle drag over for column changes
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    // If we're dragging over a column
    if (over.id.toString().startsWith('column-')) {
      // Get the column ID
      const columnId = over.id.toString().replace('column-', '');
      
      // If we're dragging a card and it's not in this column already
      if (activeCard) {
        const activeCardColumnId = statusToColumnMapping[activeCard.status || ''] || 'new';
        
        if (activeCardColumnId !== columnId) {
          // Update the card status in your data model
          const newStatus = columnToStatusMapping[columnId];
          if (newStatus) {
            onUpdateStatus(activeCard.id, newStatus);
          }
        }
      }
    }
  };

  // Handle end of dragging
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    setDraggingCardId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground">Service Request Board</h2>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary/80"></div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4">
              {columns.map(column => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                >
                  <SortableContext items={getColumnCards(column.id).map(card => card.id)}>
                    {getColumnCards(column.id).map(card => (
                      <KanbanCard
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        description={card.description}
                        priority={card.priority as number}
                        category={card.category}
                        isDragging={card.id === draggingCardId}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}
            </div>
          </DndContext>
        </div>
      )}
    </div>
  );
}