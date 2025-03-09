import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
  color?: string;
}

export function KanbanColumn({ id, title, children, color = 'bg-gray-50 border-gray-200 dark:bg-gray-900/30 dark:border-gray-700' }: KanbanColumnProps) {
  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
  });

  // Count the number of child elements
  const childCount = React.Children.count(children);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 min-h-[500px] rounded-lg border-2 ${
        isOver ? 'border-blue-400 dark:border-blue-500' : color
      } transition-colors duration-200`}
    >
      <div className="p-3 font-medium border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-foreground">{title}</span>
          <Badge variant="outline">{childCount}</Badge>
        </div>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {children}
      </div>
    </div>
  );
}