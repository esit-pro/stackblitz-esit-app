import { z } from 'zod';

// Define schemas for IT service request data
export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  category: z.string(), // Service category
  tags: z.array(z.string()).optional(),
  priority: z.number().optional(), // 1-5 scale, 5 being highest
  status: z.string().optional(), // New, In Progress, Waiting on Client, Resolved
});

export type Item = z.infer<typeof ItemSchema>;

// Mock database service with fixed IT service requests
class Database {
  private items: Item[] = [];

  constructor() {
    // Initialize with exactly 15 fixed IT service requests
    this.initializeFixedItems();
  }

  private initializeFixedItems() {
    const now = new Date();

    // Define all 15 fixed IT service request items
    this.items = [
      {
        id: 'ticket-1',
        title: 'Network Outage in Accounting Department',
        description:
          'The accounting department is experiencing a complete network outage affecting 8 workstations. Users cannot access shared drives or internet. Started approximately 30 minutes ago.',
        imageUrl:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Network',
        tags: ['outage', 'critical', 'accounting'],
        priority: 5,
        status: 'In Progress',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-2',
        title: 'Email Configuration for New Employee',
        description:
          'New marketing coordinator Jane Smith starts on Monday. Please set up email account, add to appropriate distribution lists, and configure on her laptop.',
        category: 'User Management',
        tags: ['new-hire', 'email', 'onboarding'],
        priority: 3,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 1 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 day ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-3',
        title: 'Printer Offline in Conference Room',
        description:
          'The HP LaserJet in the main conference room is showing offline status. Cannot print documents for client meeting scheduled at 2pm today.',
        imageUrl:
          'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Hardware',
        tags: ['printer', 'conference-room'],
        priority: 4,
        status: 'In Progress',
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-4',
        title: 'VPN Access for Remote Worker',
        description:
          'Developer Tom Johnson needs VPN access set up for remote work starting next week. He will be working from home permanently and needs full access to development servers.',
        category: 'Security',
        tags: ['vpn', 'remote-work', 'access'],
        priority: 3,
        status: 'Waiting on Client',
        createdAt: new Date(
          now.getTime() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(), // 2 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-5',
        title: 'CRM Software Crashing on Sales Team Computers',
        description:
          "Multiple sales team members reporting CRM application crashes when generating reports. Error log attached. Issue began after yesterday's software update.",
        imageUrl:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Software',
        tags: ['crm', 'crash', 'sales'],
        priority: 4,
        status: 'In Progress',
        createdAt: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-6',
        title: 'Server Room A/C Maintenance',
        description:
          "Schedule preventive maintenance for server room air conditioning system. Last service was 6 months ago, and we're observing slightly higher temperatures than normal.",
        category: 'Facilities',
        tags: ['server-room', 'maintenance', 'cooling'],
        priority: 3,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(), // 5 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-7',
        title: 'Windows Update Breaking Custom Application',
        description:
          'Recent Windows security update KB5025885 is causing our inventory tracking application to fail at startup. Affects 3 warehouse computers. Need rollback or fix ASAP.',
        category: 'Software',
        tags: ['windows', 'update', 'compatibility'],
        priority: 4,
        status: 'In Progress',
        createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-8',
        title: 'Backup Recovery Test',
        description:
          "Quarterly backup recovery test needed. Please restore last week's accounting database backup to test environment and verify data integrity.",
        category: 'Data Management',
        tags: ['backup', 'testing', 'compliance'],
        priority: 3,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-9',
        title: 'CEO Laptop Replacement',
        description:
          'CEO needs new laptop prepared before international trip next week. Transfer all data, email, and applications from current device. High-priority executive request.',
        imageUrl:
          'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Hardware',
        tags: ['executive', 'laptop', 'migration'],
        priority: 5,
        status: 'In Progress',
        createdAt: new Date(
          now.getTime() - 4 * 24 * 60 * 60 * 1000
        ).toISOString(), // 4 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-10',
        title: 'WiFi Signal Weak in East Wing',
        description:
          'Multiple complaints about poor WiFi connectivity in east wing offices. Signal drops frequently and speeds are below acceptable levels for video conferencing.',
        category: 'Network',
        tags: ['wifi', 'connectivity', 'signal'],
        priority: 3,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-11',
        title: 'Phishing Training for Accounting Team',
        description:
          'Schedule security awareness and phishing identification training for accounting department following recent attempt. Need 1-hour slot for 12 employees.',
        category: 'Security',
        tags: ['training', 'phishing', 'security'],
        priority: 2,
        status: 'Waiting on Client',
        createdAt: new Date(
          now.getTime() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(), // 10 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-12',
        title: 'Office 365 License Renewal',
        description:
          'Our Office 365 Business Premium licenses expire in 30 days. Please process renewal for 75 users and confirm updated billing with finance department.',
        category: 'Licensing',
        tags: ['office365', 'renewal', 'licenses'],
        priority: 3,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 6 * 24 * 60 * 60 * 1000
        ).toISOString(), // 6 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-13',
        title: 'Conference Room Video System Not Working',
        description:
          'Video conferencing system in main boardroom not connecting to calls. External clients unable to join scheduled demo at 9am. System was working yesterday.',
        imageUrl:
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Hardware',
        tags: ['conference', 'video', 'urgent'],
        priority: 5,
        status: 'In Progress',
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-14',
        title: 'Data Migration to New CRM',
        description:
          'Plan and schedule customer data migration from legacy CRM to new Salesforce instance. Approximately 50,000 customer records and associated history need transfer.',
        category: 'Data Management',
        tags: ['migration', 'crm', 'salesforce'],
        priority: 4,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(), // 14 days ago
        updatedAt: now.toISOString(),
      },
      {
        id: 'ticket-15',
        title: 'Shared Drive Permissions Audit',
        description:
          'Conduct audit of permissions on all shared network drives following department reorganization. Ensure proper access controls and remove permissions for departed employees.',
        category: 'Security',
        tags: ['audit', 'permissions', 'compliance'],
        priority: 2,
        status: 'New',
        createdAt: new Date(
          now.getTime() - 21 * 24 * 60 * 60 * 1000
        ).toISOString(), // 21 days ago
        updatedAt: now.toISOString(),
      },
    ];
  }

  async getItems(
    page = 1,
    limit = 10,
    delay = 500
  ): Promise<{ items: Item[]; total: number; hasMore: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Limit to max 20 items total
    const maxItems = Math.min(this.items.length, 20);
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, maxItems);
    const items = this.items.slice(start, end);

    return {
      items,
      total: maxItems,
      hasMore: end < maxItems,
    };
  }

  async getItemById(id: string, delay = 300): Promise<Item | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const item = this.items.find((item) => item.id === id);
    return item || null;
  }
}

// Export singleton instance
export const db = new Database();