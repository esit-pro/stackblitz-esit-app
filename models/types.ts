export interface ClientMessage {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  content: string;
  attachments?: string[];
  received: string; // ISO date string
  isRead: boolean;
  isFlagged?: boolean;
  category?: 'support' | 'inquiry' | 'feedback' | 'billing' | 'other';
  status: 'new' | 'in-triage' | 'converted' | 'archived' | 'deleted';
  assignedTo?: string;
  relatedServiceId?: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: 'New' | 'In Progress' | 'Waiting on Client' | 'Resolved';
  assignedTo?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  isInvoiced?: boolean;
  sourceMessageIds: string[]; // IDs of client messages that led to this service request
  tags?: string[];
  notes?: string;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  messages: ThreadMessage[];
  serviceRequestId?: string;
  isArchived: boolean;
}

export interface ThreadMessage {
  id: string;
  sender: 'client' | 'provider';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  isRead: boolean;
}
