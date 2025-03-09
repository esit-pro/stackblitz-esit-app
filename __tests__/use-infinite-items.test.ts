import { renderHook } from '@testing-library/react';
import { useInfiniteItems } from '@/lib/hooks/use-infinite-items';
import { db } from '@/lib/db';

// Mock the database
jest.mock('@/lib/db', () => ({
  ...jest.requireActual('@/lib/db'),
  db: {
    getItems: jest.fn(),
  },
}));

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useInfiniteItems Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // By default, mock successful response
    (db.getItems as jest.Mock).mockResolvedValue({
      items: [],
      total: 0,
      hasMore: false,
    });
  });

  it('initializes correctly', () => {
    const { result } = renderHook(() => useInfiniteItems());
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });
});