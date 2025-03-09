"use client";

import { useEffect, useState } from "react";
import { Item, db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ErrorBoundary } from "@/components/error-boundary";

interface ItemDetailProps {
  itemId?: string;
}

export function ItemDetail({ itemId }: ItemDetailProps) {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!itemId) {
      setItem(null);
      return;
    }
    
    const fetchItem = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await db.getItemById(itemId);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch item details"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItem();
  }, [itemId]);
  
  if (!itemId) {
    return <EmptyState />;
  }
  
  if (error) {
    return <ErrorState error={error} itemId={itemId} />;
  }
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold p-4 border-b">Item Details</h2>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <DetailSkeleton />
        ) : item ? (
          <ErrorBoundary fallback={<ErrorState itemId={itemId} />}>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div>
                  <h1 className="text-2xl font-bold">{item.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Image if available */}
                {item.imageUrl && (
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {/* Description */}
                <div className="mt-2">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                
                <Separator />
                
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Created
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(item.createdAt), "PPP")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Last Updated
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(item.updatedAt), "PPP")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <div 
                          key={tag}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          <Tag className="h-3.5 w-3.5" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Priority */}
                {item.priority !== undefined && (
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Priority
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${(item.priority / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.priority}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ErrorBoundary>
        ) : (
          <EmptyState />
        )}
      </ScrollArea>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-medium mb-2">No item selected</h3>
        <p className="text-muted-foreground mb-4">
          Select an item from the list to view its details here.
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error?: Error;
  itemId: string;
}

function ErrorState({ error, itemId }: ErrorStateProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Force a re-render by triggering state update in parent
      window.location.reload();
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <div className="h-full flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error ? error.message : "Failed to load item details for " + itemId}
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse" data-testid="detail-skeleton">
      <div>
        <Skeleton className="h-8 w-2/3 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      
      <Skeleton className="h-48 w-full rounded-lg" />
      
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      <Skeleton className="h-px w-full" />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}