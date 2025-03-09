import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Check, X } from 'lucide-react';

interface KanbanColumnAddButtonProps {
  onAddColumn: (title: string) => void;
}

export function KanbanColumnAddButton({ onAddColumn }: KanbanColumnAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const handleAddColumn = () => {
    if (columnTitle.trim()) {
      onAddColumn(columnTitle.trim());
      setColumnTitle('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setColumnTitle('');
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="w-72 p-3 bg-white border-2 border-dashed rounded-lg">
        <Input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          placeholder="Enter column title..."
          autoFocus
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddColumn} className="flex-1">
            <Check className="h-4 w-4 mr-1" />
            Add
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-10 w-72 border-2 border-dashed flex justify-center items-center"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Column
    </Button>
  );
}