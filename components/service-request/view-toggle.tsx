'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ListFilter, Layout } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'kanban';
  onChange: (view: 'list' | 'kanban') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => onChange(value as 'list' | 'kanban')}
    >
      <ToggleGroupItem value="list" aria-label="List View">
        <ListFilter className="h-4 w-4 mr-1" />
        List
      </ToggleGroupItem>
      <ToggleGroupItem value="kanban" aria-label="Kanban View">
        <Layout className="h-4 w-4 mr-1" />
        Kanban
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
