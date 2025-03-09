import { z } from 'zod';
import { faker } from '@faker-js/faker';

// Define schemas for IT service request data
export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  clientId: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  category: z.string(),
  priority: z.number().min(1).max(5),
  status: z.enum(['New', 'In Progress', 'Waiting on Client', 'Resolved']),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  isInvoiced: z.boolean().optional(),
  sourceMessageIds: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export type Item = z.infer<typeof ItemSchema>;

// Define data for generating realistic IT tickets
const categories = [
  'Network',
  'Hardware',
  'Software',
  'Security',
  'User Management',
  'Facilities',
  'Data Management',
  'Licensing'
];

const statusOptions = ['New', 'In Progress', 'Waiting on Client', 'Resolved'];

const tagsByCategory = {
  'Network': ['outage', 'connectivity', 'wifi', 'router', 'switch', 'vpn', 'firewall', 'signal'],
  'Hardware': ['printer', 'laptop', 'desktop', 'server', 'monitor', 'keyboard', 'mouse', 'conference', 'video'],
  'Software': ['crash', 'update', 'installation', 'compatibility', 'bug', 'crm', 'erp', 'office'],
  'Security': ['access', 'permissions', 'phishing', 'audit', 'compliance', 'vpn', 'breach', 'training'],
  'User Management': ['new-hire', 'offboarding', 'email', 'password', 'onboarding', 'account'],
  'Facilities': ['server-room', 'cooling', 'power', 'maintenance', 'furniture', 'office-move'],
  'Data Management': ['backup', 'migration', 'recovery', 'database', 'storage', 'archive', 'testing'],
  'Licensing': ['renewal', 'office365', 'licenses', 'subscription', 'compliance', 'software']
};

const imageUrls = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
];

// Common IT issue templates to make descriptions more realistic
const issueTemplates = [
  {
    title: 'Network Outage in {department} Department',
    description: 'The {department} department is experiencing a {severity} network outage affecting {count} workstations. Users cannot access {affected}. Started approximately {time} ago.'
  },
  {
    title: 'Email Configuration for New Employee',
    description: 'New {position} {name} starts on {startDay}. Please set up email account, add to appropriate distribution lists, and configure on their laptop.'
  },
  {
    title: '{device} Offline in {location}',
    description: 'The {deviceModel} in the {location} is showing offline status. Cannot {action} for {event} scheduled at {time} today.'
  },
  {
    title: 'VPN Access for Remote Worker',
    description: '{position} {name} needs VPN access set up for remote work starting next {timeframe}. They will be working from {location} {duration} and needs access to {resources}.'
  },
  {
    title: '{software} Crashing on {department} Team Computers',
    description: 'Multiple {department} team members reporting {software} application crashes when {action}. {errorDetails} Issue began after {trigger}.'
  },
  {
    title: 'Data Migration to New {system}',
    description: 'Plan and schedule {dataType} migration from legacy system to new {system} instance. Approximately {count} records and associated history need transfer.'
  }
];

// Helper function to generate random IT service request
function generateItemData(index: number): Item {
  const now = new Date();
  const pastDays = Math.floor(Math.random() * 21); // 0 to 21 days ago
  const pastHours = Math.floor(Math.random() * 48); // 0 to 48 hours ago
  
  const createdAt = new Date(now.getTime() - (pastDays * 24 * 60 * 60 * 1000) - (pastHours * 60 * 60 * 1000));
  const category = faker.helpers.arrayElement(categories);
  const priority = faker.number.int({ min: 1, max: 5 });
  
  // Higher priority items are more likely to be in progress
  let statusProbability;
  if (priority >= 4) {
    statusProbability = [0.2, 0.5, 0.2, 0.1]; // More likely In Progress
  } else if (priority === 3) {
    statusProbability = [0.4, 0.3, 0.2, 0.1]; // Balanced
  } else {
    statusProbability = [0.6, 0.2, 0.1, 0.1]; // More likely New
  }
  
  const status = faker.helpers.weightedArrayElement(
    statusOptions.map((status, i) => ({ 
      weight: statusProbability[i], 
      value: status 
    }))
  );

  // Generate tags from the appropriate category
  const availableTags = tagsByCategory[category as keyof typeof tagsByCategory] || [];
  const tags = faker.helpers.arrayElements(
    availableTags,
    faker.number.int({ min: 1, max: 3 })
  );
  
  // Sometimes add high-priority/critical tags
  if (priority >= 4) {
    if (Math.random() > 0.7) {
      tags.push('urgent');
    }
    if (Math.random() > 0.8) {
      tags.push('critical');
    }
  }
  
  // Maybe assign an image (30% chance)
  const hasImage = Math.random() > 0.7;
  const imageUrl = hasImage ? faker.helpers.arrayElement(imageUrls) : undefined;
  
  // Generate a realistic title and description
  const template = faker.helpers.arrayElement(issueTemplates);
  
  // Fill in template variables
  const departments = ['Accounting', 'Sales', 'Marketing', 'HR', 'Development', 'Executive', 'Support', 'Legal'];
  const locations = ['Main Conference Room', 'East Wing', 'West Wing', 'Boardroom', 'Building B', 'Reception', 'Lab', 'Training Room'];
  const positions = ['Marketing Coordinator', 'Developer', 'Analyst', 'Manager', 'Director', 'Assistant', 'Specialist', 'Engineer'];
  const devices = ['Printer', 'Projector', 'Scanner', 'Monitor', 'Laptop', 'Server', 'Router', 'Phone System'];
  
  // Generate title with real-world context
  let title = template.title
    .replace('{department}', faker.helpers.arrayElement(departments))
    .replace('{device}', faker.helpers.arrayElement(devices))
    .replace('{location}', faker.helpers.arrayElement(locations))
    .replace('{software}', faker.helpers.arrayElement(['CRM', 'ERP', 'Office Suite', 'Accounting Software', 'Project Management Tool', 'Email Client', 'Database']))
    .replace('{system}', faker.helpers.arrayElement(['CRM', 'Salesforce', 'SharePoint', 'ERP', 'Cloud Storage', 'Microsoft 365', 'Google Workspace']));
  
  // Generate realistic variables for description
  const severity = faker.helpers.arrayElement(['complete', 'partial', 'intermittent']);
  const count = faker.number.int({ min: 2, max: 25 });
  const affected = faker.helpers.arrayElements(['shared drives', 'internet', 'email', 'applications', 'printers', 'database'], 
    faker.number.int({ min: 1, max: 3 })).join(' or ');
  const time = faker.helpers.arrayElement(['30 minutes', '1 hour', '2 hours', 'yesterday evening']);
  const startDay = faker.helpers.arrayElement(['Monday', 'next week', 'tomorrow']);
  const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const deviceModel = `${faker.helpers.arrayElement(['HP', 'Canon', 'Epson', 'Dell', 'Lenovo', 'Apple', 'Samsung'])} ${faker.helpers.arrayElement(['LaserJet', 'Projector', 'Scanner', 'Laptop', 'Desktop', 'Server'])} ${faker.string.alphanumeric(4).toUpperCase()}`;
  const action = faker.helpers.arrayElement(['print documents', 'connect to calls', 'scan documents', 'present slides', 'access resources']);
  const event = faker.helpers.arrayElement(['client meeting', 'presentation', 'training session', 'conference call', 'workshop']);
  const timeframe = faker.helpers.arrayElement(['week', 'month', 'quarter']);
  const duration = faker.helpers.arrayElement(['permanently', 'for the next month', 'for this project', 'for the foreseeable future']);
  const resources = faker.helpers.arrayElements(['development servers', 'client database', 'shared drives', 'application resources', 'all systems'], 
    faker.number.int({ min: 1, max: 2 })).join(' and ');
  const errorDetails = Math.random() > 0.5 ? 'Error log attached. ' : '';
  const trigger = faker.helpers.arrayElement(["yesterday's software update", 'recent system changes', 'this morning\'s maintenance', 'the latest patch', 'a recent configuration change']);
  const dataType = faker.helpers.arrayElement(['customer data', 'user accounts', 'financial records', 'inventory data', 'employee records']);
  
  // Generate description with real-world context
  let description = template.description
    .replace('{department}', faker.helpers.arrayElement(departments))
    .replace('{severity}', severity)
    .replace('{count}', String(count))
    .replace('{affected}', affected)
    .replace('{time}', time)
    .replace('{position}', faker.helpers.arrayElement(positions))
    .replace('{name}', name)
    .replace('{startDay}', startDay)
    .replace('{device}', faker.helpers.arrayElement(devices))
    .replace('{deviceModel}', deviceModel)
    .replace('{location}', faker.helpers.arrayElement(locations))
    .replace('{action}', action)
    .replace('{event}', event)
    .replace('{timeframe}', timeframe)
    .replace('{duration}', duration)
    .replace('{resources}', resources)
    .replace('{software}', faker.helpers.arrayElement(['CRM', 'ERP', 'Office Suite', 'Accounting Software', 'Project Management Tool']))
    .replace('{errorDetails}', errorDetails)
    .replace('{trigger}', trigger)
    .replace('{dataType}', dataType)
    .replace('{system}', faker.helpers.arrayElement(['CRM', 'Salesforce', 'SharePoint', 'ERP']))
    .replace('{count}', faker.helpers.arrayElement(['15,000', '25,000', '50,000', '100,000']));
  
  // Create client information
  const clientId = `client-${faker.number.int({ min: 1, max: 100 })}`;
  const clientName = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const clientEmail = faker.internet.email({ firstName: clientName.split(' ')[0], lastName: clientName.split(' ')[1], provider: 'example.com' });
  
  return {
    id: `ticket-${index + 1}`,
    title,
    description,
    clientId,
    clientName,
    clientEmail,
    createdAt: createdAt.toISOString(),
    updatedAt: now.toISOString(),
    category,
    priority,
    status: status as 'New' | 'In Progress' | 'Waiting on Client' | 'Resolved',
    tags,
    imageUrl,
    sourceMessageIds: [faker.string.uuid()],
  };
}

// Mock database service with dynamically generated IT service requests
class Database {
  private items: Item[] = [];

  constructor(numItems: number = 15) {
    // Initialize with specified number of dynamically generated items
    this.generateItems(numItems);
  }

  private generateItems(count: number) {
    this.items = Array.from({ length: count }, (_, i) => generateItemData(i));
    
    // Sort items by priority (high to low) and then by creation date (newest first)
    this.items.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getItems(
    page = 1,
    limit = 10,
    delay = 500
  ): Promise<{ items: Item[]; total: number; hasMore: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const start = (page - 1) * limit;
    const end = Math.min(start + limit, this.items.length);
    const items = this.items.slice(start, end);

    return {
      items,
      total: this.items.length,
      hasMore: end < this.items.length,
    };
  }

  async getItemById(id: string, delay = 300): Promise<Item | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const item = this.items.find((item) => item.id === id);
    return item || null;
  }
  
  // Add function to regenerate items for testing
  async regenerateItems(count: number = 15, delay = 300): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, delay));
    this.generateItems(count);
    return;
  }
}

// Export singleton instance
export const db = new Database();