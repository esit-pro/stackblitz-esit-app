'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Filter,
  Search,
  Plus,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ServiceRequest } from '@/models/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServiceRequest } from '@/hooks/use-service-requests';
import { useServiceRequest as useServiceRequestContext } from '@/components/service-request/service-request-context';

export function ServiceRequestList() {
  const [filter, setFilter] = useState<
    'all' | 'new' | 'inprogress' | 'waiting' | 'resolved'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  // Use the service request context
  const { handleItemSelect, selectedItemId } = useServiceRequestContext();

  // Use the service request hook for data
  const { serviceRequests, isLoading } = useServiceRequest();

  // Filter service requests based on current filter and search term
  const filteredRequests = serviceRequests.filter((request) => {
    // Filter by status
    if (filter === 'new' && request.status !== 'New') return false;
    if (filter === 'inprogress' && request.status !== 'In Progress')
      return false;
    if (filter === 'waiting' && request.status !== 'Waiting on Client')
      return false;
    if (filter === 'resolved' && request.status !== 'Resolved') return false;

    // Search term filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.title.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.clientName.toLowerCase().includes(searchLower) ||
        request.category.toLowerCase().includes(searchLower) ||
        request.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        false
      );
    }

    return true;
  });

  // Select/deselect all visible requests
  const toggleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map((r) => r.id));
    }
  };

  // Toggle selection for a single request
  const toggleRequestSelection = (requestId: string) => {
    if (selectedRequests.includes(requestId)) {
      setSelectedRequests(selectedRequests.filter((id) => id !== requestId));
    } else {
      setSelectedRequests([...selectedRequests, requestId]);
    }
  };

  // Map status to color scheme
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Waiting on Client':
        return 'bg-purple-100 text-purple-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Map priority to color and label
  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 5:
        return { color: 'bg-red-100 text-red-800', label: 'Highest' };
      case 4:
        return { color: 'bg-orange-100 text-orange-800', label: 'High' };
      case 3:
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' };
      case 2:
        return { color: 'bg-green-100 text-green-800', label: 'Low' };
      case 1:
        return { color: 'bg-blue-100 text-blue-800', label: 'Lowest' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Medium' };
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Service Requests</h2>

          <Button>
            <Plus className="h-4 w-4 mr-1" />
            New Request
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Requests</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Requests
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('new')}>
                New Requests
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('inprogress')}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('waiting')}>
                Waiting on Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('resolved')}>
                Resolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bulk action toolbar - visible when requests are selected */}
      {selectedRequests.length > 0 && (
        <div className="border-b p-2 bg-muted/50 flex items-center gap-2">
          <Checkbox
            checked={selectedRequests.length === filteredRequests.length}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm">{selectedRequests.length} selected</span>
          <div className="flex-1"></div>
          <Button size="sm" variant="outline">
            Assign
          </Button>
          <Button size="sm" variant="outline">
            Change Status
          </Button>
          <Button size="sm" variant="outline">
            Export
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="divide-y">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => <RequestSkeleton key={i} />)
          ) : filteredRequests.length === 0 ? (
            // Empty state
            <div className="p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 mx-auto text-muted-foreground"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <h3 className="mt-2 font-medium">No service requests found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : filter !== 'all'
                  ? `No ${filter} service requests`
                  : 'No service requests available'}
              </p>
            </div>
          ) : (
            // Request list
            filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`hover:bg-muted/50 transition-colors ${
                  request.id === selectedItemId ? 'bg-muted' : ''
                }`}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center mt-1 space-x-2">
                      <Checkbox
                        checked={selectedRequests.includes(request.id)}
                        onCheckedChange={() =>
                          toggleRequestSelection(request.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleItemSelect(request)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{request.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Client: {request.clientName} ({request.clientEmail})
                          </p>
                        </div>

                        <div className="flex items-center">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 ml-1"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>
                                Message Client
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Change Status</DropdownMenuItem>
                              <DropdownMenuItem>Reassign</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Add Time Entry
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Create Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {request.description}
                      </p>

                      <div className="flex flex-wrap items-center mt-2 gap-x-4 gap-y-2">
                        <Badge
                          variant="outline"
                          className={getPriorityInfo(request.priority).color}
                        >
                          P{request.priority}:{' '}
                          {getPriorityInfo(request.priority).label}
                        </Badge>

                        <Badge variant="secondary">{request.category}</Badge>

                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Created{' '}
                          {formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          })}
                        </span>

                        {request.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Due{' '}
                            {formatDistanceToNow(new Date(request.dueDate), {
                              addSuffix: true,
                            })}
                          </span>
                        )}

                        {request.assignedTo && (
                          <span className="text-xs text-muted-foreground">
                            Assigned to: {request.assignedTo}
                          </span>
                        )}

                        {request.tags && request.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            <div className="flex gap-1">
                              {request.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-xs">
                                  {tag}
                                </span>
                              ))}
                              {request.tags.length > 2 && (
                                <span className="text-xs">
                                  +{request.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function RequestSkeleton() {
  return (
    <div className="px-4 py-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex items-center mt-1 space-x-2">
          <div className="h-4 w-4 rounded-sm bg-muted"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="w-1/3 h-4 bg-muted rounded"></div>
            <div className="w-1/5 h-5 bg-muted rounded"></div>
          </div>

          <div className="w-1/4 h-3 bg-muted rounded mt-1"></div>
          <div className="w-full h-4 bg-muted rounded mt-3"></div>
          <div className="w-3/4 h-4 bg-muted rounded mt-1"></div>

          <div className="flex mt-3 gap-2">
            <div className="w-16 h-5 bg-muted rounded"></div>
            <div className="w-16 h-5 bg-muted rounded"></div>
            <div className="w-32 h-5 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
