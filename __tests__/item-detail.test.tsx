import React from 'react';
import { render, screen } from '@testing-library/react';
import { ItemDetail } from '@/components/items/item-detail';
import { db } from '@/lib/db';

// Mock the database
jest.mock('@/lib/db', () => ({
  ItemSchema: jest.requireActual('@/lib/db').ItemSchema,
  db: {
    getItemById: jest.fn(),
  },
}));

describe('ItemDetail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no itemId is provided', () => {
    render(<ItemDetail />);
    expect(screen.getByText('No item selected')).toBeInTheDocument();
  });
});