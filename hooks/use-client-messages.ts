import { useState } from 'react';

// Define the ClientMessage type to match your interface
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

export function useClientMessages() {
  // Mock message data that matches the ClientMessage interface
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      id: 'msg1',
      clientId: 'client001',
      clientName: 'Support Vendor',
      clientEmail: 'support@vendor.com',
      subject: 'RE: Software License Request',
      content:
        'Your request for additional licenses has been approved. Please find attached the license keys and installation instructions.',
      attachments: ['license_keys.txt', 'installation_guide.pdf'],
      received: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      isRead: true,
      category: 'billing',
      status: 'archived',
    },
    {
      id: 'msg2',
      clientId: 'client002',
      clientName: 'John Smith',
      clientEmail: 'john.smith@client.com',
      subject: 'Printer not working',
      content:
        "Our main office printer is showing error code E-502. I've attached photos of the error and system log as requested.",
      attachments: ['printer_error.jpg', 'system_log.txt'],
      received: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      isRead: false,
      category: 'support',
      status: 'new',
    },
    {
      id: 'msg3',
      clientId: 'client003',
      clientName: 'IT Notifications',
      clientEmail: 'it-notifications@company.com',
      subject: 'Scheduled Maintenance Notice',
      content:
        'Please be advised that there will be scheduled maintenance this weekend. All systems will be unavailable from Saturday 10PM to Sunday 2AM.',
      attachments: [],
      received: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      isRead: true,
      category: 'other',
      status: 'in-triage',
    },
    {
      id: 'msg4',
      clientId: 'client004',
      clientName: 'Security Team',
      clientEmail: 'security@company.com',
      subject: 'Security Alert: Unauthorized Access Attempt',
      content:
        'Our systems detected an unauthorized access attempt to your account. Please review the attached log and confirm if this was you.',
      attachments: ['security_log.txt'],
      received: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      isRead: false,
      category: 'support',
      status: 'new',
      isFlagged: true,
    },
  ]);

  // Function to mark a message as read
  const markAsRead = (id: string) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  // Function to update message status
  const updateStatus = (
    id: string,
    status: 'new' | 'in-triage' | 'converted' | 'archived' | 'deleted'
  ) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, status } : msg))
    );
  };

  // Function to flag/unflag a message
  const toggleFlag = (id: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, isFlagged: !msg.isFlagged } : msg
      )
    );
  };

  return {
    messages,
    markAsRead,
    updateStatus,
    toggleFlag,
  };
}
