"use client";

import { useState, useEffect } from 'react';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { useServiceRequest, ServiceRequestProvider } from '@/components/service-request/service-request-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RotateCcw } from 'lucide-react';
import { Item as ServiceRequest } from '@/lib/db';

// Create a wrapper component that uses the context
function ServiceRequestBoardContent() {
  const { 
    serviceRequests, 
    loading, 
    error, 
    fetchServiceRequests,
    updateServiceRequestStatus
  } = useServiceRequest();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Initial load
  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);
  
  // Filter service requests based on search and filters
  const filteredRequests = serviceRequests.filter(request => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      request.category === categoryFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || 
      request.priority === parseInt(priorityFilter);
    
    return matchesSearch && matchesCategory && matchesPriority;
  });
  
  // Handle service request status update
  const handleUpdateStatus = async (id: string, status: string) => {
    await updateServiceRequestStatus(id, status as ServiceRequest['status']);
    // Refresh after update
    fetchServiceRequests();
  };
  
  // Get unique categories for filter dropdown
  const categories = Array.from(
    new Set(serviceRequests.map(request => request.category))
  );
  
  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Service Request Board</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-auto"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="5">Critical (5)</SelectItem>
              <SelectItem value="4">High (4)</SelectItem>
              <SelectItem value="3">Medium (3)</SelectItem>
              <SelectItem value="2">Low (2)</SelectItem>
              <SelectItem value="1">Minimal (1)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => fetchServiceRequests()}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      ) : (
        <KanbanBoard
          serviceRequests={filteredRequests}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onRefresh={fetchServiceRequests}
        />
      )}
    </div>
  );
}

// Export the page component wrapped with the provider
export default function ServiceRequestBoardPage() {
  return (
    <ServiceRequestProvider>
      <ServiceRequestBoardContent />
    </ServiceRequestProvider>
  );
}