'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Search,
  Plus,
  Calendar,
  Clock,
  Tag,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServiceRequest } from '@/components/service-request/service-request-context';
import { ServiceRequest } from '@/hooks/use-service-requests';

// Map status to color scheme for theme compatibility
const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Waiting on Client':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'Resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

// Map priority to color and label with theme compatibility
const getPriorityInfo = (priority: number) => {
  switch (priority) {
    case 5:
      return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Highest' };
    case 4:
      return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'High' };
    case 3:
      return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Medium' };
    case 2:
      return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Low' };
    case 1:
      return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Lowest' };
    default:
      return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', label: 'Medium' };
  }
};

// Define the RequestSkeleton component before it's used
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

// ServiceRequestDetails component definition
const ServiceRequestDetails = ({ serviceRequest }: { serviceRequest: ServiceRequest | null }) => {
  // If serviceRequest is null, don't render anything
  if (!serviceRequest) return null;
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{serviceRequest.title}</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Description</h3>
          <p className="text-muted-foreground">{serviceRequest.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Client</h4>
            <p>{serviceRequest.clientName}</p>
            <p className="text-sm text-muted-foreground">{serviceRequest.clientEmail}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Status</h4>
            <Badge className={getStatusColor(serviceRequest.status)}>
              {serviceRequest.status}
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Priority</h4>
            <Badge variant="outline" className={getPriorityInfo(serviceRequest.priority).color}>
              P{serviceRequest.priority}: {getPriorityInfo(serviceRequest.priority).label}
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Category</h4>
            <Badge variant="secondary">{serviceRequest.category}</Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Details</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Created</h4>
                <p className="text-sm flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {formatDistanceToNow(new Date(serviceRequest.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              
              {serviceRequest.dueDate && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Due</h4>
                  <p className="text-sm flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDistanceToNow(new Date(serviceRequest.dueDate as string), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              )}
              
              {serviceRequest.assignedTo && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                  <p className="text-sm">{serviceRequest.assignedTo}</p>
                </div>
              )}
            </div>
            
            {serviceRequest.tags && serviceRequest.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {serviceRequest.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function ServiceRequestList() {
  const [filter, setFilter] = useState<
    'all' | 'new' | 'inprogress' | 'waiting' | 'resolved'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  // Use the service request context
  const { 
    serviceRequests, 
    loading: isLoading, 
    loadingDetails,
    error,
    fetchServiceRequests,
    regenerateServiceRequests,
    currentServiceRequest,
    fetchServiceRequestById
  } = useServiceRequest();

  // Handler for selecting a service request
  const handleItemSelect = (request: ServiceRequest) => {
    setSelectedRequests([]);
    
    // If the same request is clicked again, deselect it
    if (currentServiceRequest && currentServiceRequest.id === request.id) {
      // Set current service request to null by loading an empty ID
      // This effectively clears the current service request
      fetchServiceRequestById(''); // This will cause the current request to be cleared
    } else {
      fetchServiceRequestById(request.id);
    }
  };

  // Selected item ID derived from current service request
  const selectedItemId = currentServiceRequest?.id;

  // Load service requests on component mount
  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

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

  // Map status to color scheme for theme compatibility
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Waiting on Client':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  // Map priority to color and label with theme compatibility
  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 5:
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Highest' };
      case 4:
        return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'High' };
      case 3:
        return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Medium' };
      case 2:
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Low' };
      case 1:
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Lowest' };
      default:
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', label: 'Medium' };
    }
  };

  // Handle regenerating service requests
  const handleRegenerateRequests = async () => {
    setSelectedRequests([]); // Clear selections
    await regenerateServiceRequests();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Service Requests</h2>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="icon"
              onClick={handleRegenerateRequests}
              disabled={isLoading}
              title="Regenerate requests with random data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Request
            </Button>
          </div>
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
          <span className="text-sm text-foreground">{selectedRequests.length} selected</span>
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

      {/* Error state */}
      {error && (
        <div className="p-4 text-center text-red-500">
          <p>Error: {error.message}</p>
          <Button 
            onClick={() => fetchServiceRequests()} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main content area with list and details pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Service request list - transitions width using CSS */}
        <div 
          className={`overflow-hidden ${currentServiceRequest ? 'w-[60%]' : 'w-full'} transition-all duration-300 ease-in-out`}
        >
          <ScrollArea className="h-full border-r">
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
                <h3 className="mt-2 font-medium text-foreground">No service requests found</h3>
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
              filteredRequests.map((request: ServiceRequest) => (
                <div
                  key={request.id}
                  className={`hover:bg-muted/50 transition-colors ${
                    request.id === selectedItemId ? 'bg-muted/80' : ''
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
                          <h3 className="font-medium text-foreground">{request.title}</h3>
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
                              {request.tags.slice(0, 2).map((tag: string) => (
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
      
        {/* Service request details pane - slides in when a request is selected using CSS */}
        <div 
          className={`w-[40%] min-w-[350px] overflow-auto border-l transform transition-all duration-300 ease-in-out ${currentServiceRequest ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none absolute right-0'}`}
        >
              {loadingDetails ? (
                <div className="p-6 space-y-4">
                  <div className="h-8 w-3/4 bg-muted/60 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-muted/60 rounded animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-muted/60 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-muted/60 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-muted/60 rounded animate-pulse"></div>
                      <div className="h-6 w-24 bg-muted/60 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <ServiceRequestDetails serviceRequest={currentServiceRequest} />
              )}
        </div>
      </div>
    </div>
  );
}
