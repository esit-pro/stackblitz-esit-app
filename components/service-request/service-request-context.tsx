// components/service-request/service-request-context.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Item as ServiceRequest, db } from '../../lib/db';
import { clientMsgDb, ClientMessage } from '../../lib/client-messages-db';

export interface ServiceRequestContextType {
  serviceRequests: ServiceRequest[];
  currentServiceRequest: ServiceRequest | null;
  loading: boolean;
  error: Error | null;
  fetchServiceRequests: (page?: number, limit?: number) => Promise<void>;
  fetchServiceRequestById: (id: string) => Promise<void>;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => Promise<boolean>;
  updateServiceRequestPriority: (id: string, priority: ServiceRequest['priority']) => Promise<boolean>;
  getRelatedMessages: (serviceRequestId: string) => Promise<ClientMessage[]>;
  convertMessageToServiceRequest: (message: ClientMessage, category: string, priority: number) => Promise<string | null>;
  linkMessageToServiceRequest: (messageId: string, serviceRequestId: string) => Promise<boolean>;
}

const ServiceRequestContext = createContext<ServiceRequestContextType | undefined>(undefined);

interface ServiceRequestProviderProps {
  children: ReactNode;
}

export const ServiceRequestProvider: React.FC<ServiceRequestProviderProps> = ({ children }) => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [currentServiceRequest, setCurrentServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchServiceRequests = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const { items } = await db.getItems(page, limit);
      setServiceRequests(items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch service requests'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServiceRequestById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const serviceRequest = await db.getItemById(id);
      setCurrentServiceRequest(serviceRequest);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch service request'));
    } finally {
      setLoading(false);
    }
  }, []);

  // In a real app, these methods would make API calls to update the database
  const updateServiceRequestStatus = useCallback(async (id: string, status: ServiceRequest['status']) => {
    try {
      // This is a mock implementation - in a real app, you'd call an API
      setServiceRequests(prev => 
        prev.map(sr => sr.id === id ? { ...sr, status, updatedAt: new Date().toISOString() } : sr)
      );
      
      if (currentServiceRequest?.id === id) {
        setCurrentServiceRequest(prev => 
          prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null
        );
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update service request status'));
      return false;
    }
  }, [currentServiceRequest]);

  const updateServiceRequestPriority = useCallback(async (id: string, priority: ServiceRequest['priority']) => {
    try {
      // This is a mock implementation - in a real app, you'd call an API
      setServiceRequests(prev => 
        prev.map(sr => sr.id === id ? { ...sr, priority, updatedAt: new Date().toISOString() } : sr)
      );
      
      if (currentServiceRequest?.id === id) {
        setCurrentServiceRequest(prev => 
          prev ? { ...prev, priority, updatedAt: new Date().toISOString() } : null
        );
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update service request priority'));
      return false;
    }
  }, [currentServiceRequest]);

  const getRelatedMessages = useCallback(async (serviceRequestId: string) => {
    try {
      return await clientMsgDb.getRelatedMessages(serviceRequestId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get related messages'));
      return [];
    }
  }, []);

  const convertMessageToServiceRequest = useCallback(async (
    message: ClientMessage, 
    category: string, 
    priority: number
  ): Promise<string | null> => {
    try {
      // In a real implementation, this would create a new service request in the database
      // For now, we'll simulate the creation
      const newId = `ticket-${serviceRequests.length + 1}`;
      const newServiceRequest: ServiceRequest = {
        id: newId,
        title: message.subject,
        description: message.content,
        category,
        priority: priority as ServiceRequest['priority'],
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: message.category ? [message.category] : [],
      };
      
      // Update local state
      setServiceRequests(prev => [...prev, newServiceRequest]);
      
      // Update message status to 'converted' and link it to the new service request
      await clientMsgDb.updateMessageStatus(message.id, 'converted');
      await clientMsgDb.assignMessage(message.id, 'relatedServiceId', newId);
      
      return newId;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to convert message to service request'));
      return null;
    }
  }, [serviceRequests]);

  const linkMessageToServiceRequest = useCallback(async (
    messageId: string, 
    serviceRequestId: string
  ): Promise<boolean> => {
    try {
      // In a real implementation, this would update both the message and service request in the database
      // For now, we'll simulate by updating the client message
      return await clientMsgDb.assignMessage(messageId, 'relatedServiceId', serviceRequestId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to link message to service request'));
      return false;
    }
  }, []);

  const value = {
    serviceRequests,
    currentServiceRequest,
    loading,
    error,
    fetchServiceRequests,
    fetchServiceRequestById,
    updateServiceRequestStatus,
    updateServiceRequestPriority,
    getRelatedMessages,
    convertMessageToServiceRequest,
    linkMessageToServiceRequest,
  };

  return (
    <ServiceRequestContext.Provider value={value}>
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequest = () => {
  const context = useContext(ServiceRequestContext);
  if (context === undefined) {
    throw new Error('useServiceRequest must be used within a ServiceRequestProvider');
  }
  return context;
};

// You can use this hook in your components like:
// const { serviceRequests, fetchServiceRequests } = useServiceRequest();