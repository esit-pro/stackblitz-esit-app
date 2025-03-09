import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components
jest.mock('@/components/items/item-list', () => ({
  ItemList: () => <div data-testid="item-list-component">Item List Mock</div>,
}));

jest.mock('@/components/items/item-detail', () => ({
  ItemDetail: () => <div data-testid="item-detail-component">Item Detail Mock</div>,
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="scroll-area">{children}</div>,
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByTestId('item-list-component')).toBeInTheDocument();
    expect(screen.getByTestId('item-detail-component')).toBeInTheDocument();
  });
});