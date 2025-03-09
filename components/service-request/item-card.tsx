'use client';

import { Item } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Map of status to color schemes
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Waiting on Client': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800',
};

interface ItemCardProps {
  item: Item;
  isSelected?: boolean;
  onClick?: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
  compact?: boolean;
}

export function ItemCard({
  item,
  isSelected,
  onClick,
  isDragging,
  dragHandleProps = {},
  compact = false,
}: ItemCardProps) {
  const statusColor = item.status
    ? STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] ||
      'bg-gray-100 text-gray-800'
    : '';

  if (compact) {
    // Compact card for Kanban view
    return (
      <Card
        {...dragHandleProps}
        className={cn(
          'cursor-pointer transition-all',
          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50',
          isDragging && 'rotate-1 scale-105'
        )}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
            {item.priority && (
              <span
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium',
                  item.priority >= 5
                    ? 'bg-red-100 text-red-800'
                    : item.priority >= 4
                    ? 'bg-orange-100 text-orange-800'
                    : item.priority >= 3
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                )}
              >
                {item.priority}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
            {item.description}
          </p>

          <div className="flex justify-between items-center mt-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {item.category}
            </Badge>

            {item.tags && item.tags.length > 0 && (
              <div className="flex gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full card for list view
  return (
    <Card
      {...dragHandleProps}
      className={cn(
        'cursor-pointer transition-colors',
        isSelected ? 'border-primary bg-primary/10' : 'hover:bg-muted'
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {item.imageUrl && (
            <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium truncate">{item.title}</h3>
              <div className="flex items-center gap-1">
                {item.status && (
                  <Badge className={cn('font-normal', statusColor)}>
                    {item.status}
                  </Badge>
                )}
                <Badge variant="secondary">{item.category}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {item.description}
            </p>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
