"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Item, db } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

interface UseInfiniteItemsOptions {
  initialPage?: number;
  limit?: number;
  initialDelay?: number;
  subsequentDelay?: number;
  maxItems?: number;
}

interface UseInfiniteItemsReturn {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

export function useInfiniteItems({
  initialPage = 1,
  limit = 10,
  initialDelay = 1000,
  subsequentDelay = 500,
  maxItems = 20
}: UseInfiniteItemsOptions = {}): UseInfiniteItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isInitialLoad = useRef(true);
  const { toast } = useToast();
  
  const fetchItems = useCallback(async (pageToFetch: number, refresh = false) => {
    try {
      // Use initialDelay for the first load, subsequentDelay for others
      const delay = isInitialLoad.current ? initialDelay : subsequentDelay;
      isInitialLoad.current = false;
      
      const { items: newItems, hasMore: more } = await db.getItems(pageToFetch, limit, delay);
      
      if (refresh) {
        setItems(newItems);
      } else {
        setItems(prev => {
          // Limit the total number of items
          const combined = [...prev, ...newItems];
          return combined.slice(0, maxItems);
        });
      }
      
      // If we've reached the maximum number of items, don't allow loading more
      setHasMore(more && items.length < maxItems - 1);
      setIsError(false);
      setError(null);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Failed to fetch items"));
      toast({
        title: "Error",
        description: "Failed to load items. Please try again.",
        variant: "destructive",
      });
    }
  }, [initialDelay, limit, subsequentDelay, toast, items.length, maxItems]);
  
  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchItems(initialPage).finally(() => setIsLoading(false));
  }, [fetchItems, initialPage]);
  
  // Load more function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || items.length >= maxItems) return;
    
    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchItems(nextPage);
    setIsLoading(false);
  }, [fetchItems, hasMore, isLoading, page, items.length, maxItems]);
  
  // Refresh function
  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setPage(initialPage);
    await fetchItems(initialPage, true);
    setIsRefreshing(false);
  }, [fetchItems, initialPage, isRefreshing]);
  
  return {
    items,
    isLoading,
    isError,
    error,
    hasMore,
    loadMore,
    refresh,
    isRefreshing
  };
}