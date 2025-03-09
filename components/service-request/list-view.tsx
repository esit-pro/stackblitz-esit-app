'use client'

import { useRef } from 'react';
import { Item } from '@/lib/db';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ItemCard } from './item-card';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface ListViewProps {
  items: Item[];
  onReorder?: (items: Item[]) => void;
  onItemSelect: (item: Item) => void;
  selectedItemId?: string;
  sortMode?: boolean;
  onSortModeChange?: (value: boolean) => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function ListView({
  items,
  onReorder,
  onItemSelect,
  selectedItemId,
  sortMode = false,
  onSortModeChange,
  hasMore = false,
  isLoading = false,
}: ListViewProps) {
  const loadingRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex flex-col">
      {onSortModeChange && (
        <div className="px-4 py-2 flex items-center space-x-2">
          <Switch
            id="sort-mode"
            checked={sortMode}
            onCheckedChange={onSortModeChange}
          />
          <Label htmlFor="sort-mode">Sort Mode</Label>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sortMode ? (
            // Reorderable list
            <Reorder.Group
              axis="y"
              values={items}
              onReorder={onReorder || (() => {})}
              className="space-y-2"
            >
              {items.map((item) => (
                <ReorderableItem
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedItemId}
                  onSelect={() => onItemSelect(item)}
                />
              ))}
            </Reorder.Group>
          ) : (
            // Regular list
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                isSelected={item.id === selectedItemId}
                onClick={() => onItemSelect(item)}
              />
            ))
          )}

          {/* Loading indicator at the bottom */}
          {hasMore && (
            <div ref={loadingRef} className="py-4">
              <ItemSkeleton />
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && items.length > 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No more service requests
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
function ReorderableItem({
  item,
  isSelected,
  onSelect,
}: {
  item: Item;
  isSelected?: boolean;
  onSelect: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item value={item} dragControls={dragControls}>
      <div className="flex items-center">
        <div
          className="flex-shrink-0 cursor-grab px-1"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <ItemCard item={item} isSelected={isSelected} onClick={onSelect} />
        </div>
      </div>
    </Reorder.Item>
  );
}

function ItemSkeleton() {
  return (
    <div className="p-3 rounded-lg border">
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3 mt-1" />
          <div className="flex gap-1 mt-2">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
