'use client'

import { Item } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ItemCard } from './item-card';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';

interface KanbanViewProps {
  items: Item[];
  onItemSelect: (item: Item) => void;
  selectedItemId?: string;
  onItemMove?: (result: DropResult, items: Item[]) => Item[];
}

// Define status columns for Kanban view
const STATUS_COLUMNS = [
  { id: 'new', label: 'New' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'waiting-on-client', label: 'Waiting on Client' },
  { id: 'resolved', label: 'Resolved' },
];

export function KanbanView({
  items,
  onItemSelect,
  selectedItemId,
  onItemMove,
}: KanbanViewProps) {
  // Group items by status
  const itemsByStatus = STATUS_COLUMNS.reduce((acc, column) => {
    acc[column.id] = items.filter((item) => {
      const status = item.status || 'New';
      return status.toLowerCase().replace(/\s+/g, '-') === column.id;
    });
    return acc;
  }, {} as Record<string, Item[]>);

  // Handle drag and drop between columns
  const handleDragEnd = (result: DropResult) => {
    if (!onItemMove) return;

    // Update items with the result of the move
    const updatedItems = onItemMove(result, items);

    // No need to update state here as it will be handled by the parent component
  };

  return (
    <div className="h-full overflow-auto p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {STATUS_COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <div className="font-medium text-sm mb-2 px-2 py-1 bg-muted rounded flex items-center justify-between">
                {column.label}
                <Badge variant="secondary" className="ml-2">
                  {itemsByStatus[column.id]?.length || 0}
                </Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex-1 p-2 rounded-md space-y-2 min-h-[200px] transition-colors',
                      snapshot.isDraggingOver ? 'bg-muted/80' : 'bg-muted/30'
                    )}
                  >
                    {itemsByStatus[column.id]?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <ItemCard
                              item={item}
                              isSelected={item.id === selectedItemId}
                              onClick={() => onItemSelect(item)}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                              compact={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
