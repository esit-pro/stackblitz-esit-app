import { useState } from 'react';

// Define the ServiceRequest type based on your data model
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  category: string;
  priority: number; // Accepts any number but recommended to use 1-5 scale
  status: 'New' | 'In Progress' | 'Waiting on Client' | 'Resolved';
  assignedTo?: string;
  dueDate?: string | Date;
  estimatedHours?: number;
  actualHours?: number;
  isInvoiced?: boolean;
  sourceMessageIds: string[]; // IDs of client messages that led to this service request
  tags?: string[];
  notes?: string;
  attachments?: string[];
}

export function useServiceRequests() {
  // Mock service request data
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'SR001',
      title: 'Network printer installation',
      description:
        'Need assistance setting up new network printer in the marketing department',
      clientId: 'client002',
      clientName: 'John Smith',
      clientEmail: 'john.smith@client.com',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Hardware',
      priority: 3,
      status: 'In Progress',
      assignedTo: 'tech-support-1',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 2,
      actualHours: 1.5,
      sourceMessageIds: ['msg2'],
      tags: ['printer', 'installation'],
      notes:
        'Customer has already unboxed the printer and installed ink cartridges',
    },
    {
      id: 'SR002',
      title: 'Software license renewal',
      description: 'Annual renewal for Adobe Creative Cloud licenses',
      clientId: 'client001',
      clientName: 'Support Vendor',
      clientEmail: 'support@vendor.com',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Licensing',
      priority: 2,
      status: 'Waiting on Client',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 1,
      sourceMessageIds: ['msg1'],
      tags: ['license', 'renewal', 'adobe'],
    },
    {
      id: 'SR003',
      title: 'Email account setup',
      description:
        'Create new email accounts for three new hires in the sales department',
      clientId: 'client005',
      clientName: 'HR Department',
      clientEmail: 'hr@company.com',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Email',
      priority: 1,
      status: 'New',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedHours: 1.5,
      sourceMessageIds: [],
      tags: ['email', 'new hire'],
    },
    {
      id: 'SR004',
      title: 'Data recovery',
      description: 'Recover files from crashed laptop hard drive',
      clientId: 'client006',
      clientName: 'Finance Team',
      clientEmail: 'finance@company.com',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      category: 'Data Recovery',
      priority: 5,
      status: 'In Progress',
      assignedTo: 'tech-support-2',
      estimatedHours: 8,
      actualHours: 4,
      sourceMessageIds: [],
      tags: ['urgent', 'data recovery', 'hardware failure'],
      notes:
        'Drive has physical damage, attempting level 2 recovery procedures',
    },
    {
      id: 'SR005',
      title: 'VPN access issue',
      description: 'Unable to connect to company VPN when working remotely',
      clientId: 'client007',
      clientName: 'Remote Worker',
      clientEmail: 'remote@company.com',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Network',
      priority: 4,
      status: 'Resolved',
      assignedTo: 'network-admin',
      estimatedHours: 3,
      actualHours: 1,
      sourceMessageIds: [],
      tags: ['vpn', 'remote access'],
      notes: 'Issue resolved by updating VPN client and refreshing credentials',
    },
  ]);

  // Function to update request status
  const updateStatus = (
    id: string,
    status: 'New' | 'In Progress' | 'Waiting on Client' | 'Resolved'
  ) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              status,
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  // Function to update request assignee
  const assignRequest = (id: string, assignedTo: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              assignedTo,
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  // Function to update request priority
  const updatePriority = (id: string, priority: 1 | 2 | 3 | 4 | 5) => {
    setRequests(
      requests.map((req) =>
        req.id === id
          ? {
              ...req,
              priority,
              updatedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  // Function to log hours worked
  const logHours = (id: string, additionalHours: number) => {
    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          const currentHours = req.actualHours || 0;
          return {
            ...req,
            actualHours: currentHours + additionalHours,
            updatedAt: new Date().toISOString(),
          };
        }
        return req;
      })
    );
  };

  // Function to add a note
  const addNote = (id: string, note: string) => {
    setRequests(
      requests.map((req) => {
        if (req.id === id) {
          const updatedNotes = req.notes
            ? `${req.notes}\n\n${new Date().toLocaleString()}: ${note}`
            : `${new Date().toLocaleString()}: ${note}`;

          return {
            ...req,
            notes: updatedNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return req;
      })
    );
  };

  return {
    requests,
    updateStatus,
    assignRequest,
    updatePriority,
    logHours,
    addNote,
  };
}
