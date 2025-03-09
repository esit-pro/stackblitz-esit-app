import React from 'react';
import { render, screen } from '@testing-library/react';
import { ItemList } from '@/components/items/item-list';
import { useInfiniteItems } from '@/lib/hooks/use-infinite-items';
import type { Item } from '@/lib/db';

// Mock the hook
jest.mock('@/lib/hooks/use-infinite-items');

// Mock data
const mockItems: Item[] = [
  {
    id: 'item-1',
    title: 'Test Item 1',
    description: 'Description for test item 1',
    category: 'Test Category',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    tags: ['tag1', 'tag2'],
    priority: 3,
  },
  {
    id: 'item-2',
    title: 'Test Item 2',
    description: 'Description for test item 2',
    category: 'Another Category',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    imageUrl: 'https://example.com/image.jpg',
    tags: ['tag3'],
    priority: 2,
  },
];

describe('ItemList Component', () => {
  beforeEach(() => {
    // Mock implementation of useInfiniteItems
    (useInfiniteItems as jest.Mock).mockReturnValue({
      items: mockItems,
      isLoading: false,
      isError: false,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      refresh: jest.fn(),
      isRefreshing: false,
    });
  });

  it('renders correctly', () => {
    const onItemSelect = jest.fn();
    render(<ItemList onItemSelect={onItemSelect} selectedItemId="item-1" />);
    expect(screen.getByText('Items List')).toBeInTheDocument();
  });
});