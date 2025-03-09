import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, AlertCircle, BarChart } from 'lucide-react';

interface KanbanCardProps {
  id: string;
  title: string;
  description?: string;
  priority?: number;
  category?: string;
  isDragging?: boolean;
}

export function KanbanCard({ 
  id, 
  title, 
  description, 
  priority = 3,
  category,
  isDragging = false
}: KanbanCardProps) {
  // Set up sortable item
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id });

  // Apply styles
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  // Get priority label and color with theme compatibility
  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 5:
        return { label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800' };
      case 4:
        return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800' };
      case 3:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800' };
      case 2:
        return { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800' };
      case 1:
        return { label: 'Minimal', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800' };
      default:
        return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800' };
    }
  };

  const priorityInfo = getPriorityInfo(priority);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium line-clamp-2 text-foreground">
            {title}
          </CardTitle>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-2">
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className={priorityInfo.color}>
            <BarChart className="h-3 w-3 mr-1" />
            {priorityInfo.label}
          </Badge>
          
          {category && (
            <Badge variant="outline">
              {category}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}