// lib/client-messages-db.ts
import { z } from 'zod';

// Define schemas for client message data
export const ClientMessageSchema = z.object({
  id: z.string(),
  clientId: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  subject: z.string(),
  content: z.string(),
  attachments: z.array(z.string()).optional(),
  received: z.string(), // ISO date string
  isRead: z.boolean(),
  isFlagged: z.boolean().optional(),
  category: z.enum(['support', 'inquiry', 'feedback', 'billing', 'other']).optional(),
  status: z.enum(['new', 'in-triage', 'converted', 'archived', 'deleted']),
  assignedTo: z.string().optional(),
  relatedServiceId: z.string().optional(),
});

export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export const ThreadMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(['client', 'provider']),
  senderName: z.string(),
  content: z.string(),
  timestamp: z.string(),
  attachments: z.array(z.string()).optional(),
  isRead: z.boolean(),
});

export type ThreadMessage = z.infer<typeof ThreadMessageSchema>;

export const MessageThreadSchema = z.object({
  id: z.string(),
  messages: z.array(ThreadMessageSchema),
  serviceRequestId: z.string().optional(),
  isArchived: z.boolean(),
});

export type MessageThread = z.infer<typeof MessageThreadSchema>;

// Mock client message database service
class ClientMessagesDatabase {
  private clientMessages: ClientMessage[] = [];
  private messageThreads: MessageThread[] = [];

  constructor() {
    // Initialize with sample client messages and threads
    this.initializeMessages();
  }

  private initializeMessages() {
    const now = new Date();
    
    // Client messages corresponding to some of the service requests
    this.clientMessages = [
      {
        id: 'msg-1',
        clientId: 'client-accounting',
        clientName: 'Sarah Johnson',
        clientEmail: 'sjohnson@acme-accounting.com',
        subject: 'URGENT: Network Down in Accounting',
        content: 'Our entire accounting department is unable to access the network. This is preventing us from processing end-of-month reports which are due today. None of the 8 workstations can connect to shared drives or internet. Please send someone ASAP.',
        received: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-1',
      },
      {
        id: 'msg-2',
        clientId: 'client-marketing',
        clientName: 'Mark Wilson',
        clientEmail: 'mwilson@company.com',
        subject: 'Email Setup for New Hire',
        content: 'Our new marketing coordinator Jane Smith starts next Monday. Can you please set up her email account and make sure it\'s configured on her new laptop? She\'ll need to be added to the marketing@company.com and press@company.com distribution lists as well.',
        attachments: ['jane_smith_onboarding.pdf'],
        received: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(), // 26 hours ago
        isRead: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-2',
      },
      {
        id: 'msg-3',
        clientId: 'client-sales',
        clientName: 'Alicia Rodriguez',
        clientEmail: 'arodriguez@company.com',
        subject: 'Conference Room Printer Not Working',
        content: 'The printer in the main conference room isn\'t working. I\'ve tried restarting it but it still shows as offline. We have an important client presentation at 2pm today and need to print handouts. Please help!',
        received: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-3',
      },
      {
        id: 'msg-4',
        clientId: 'client-dev',
        clientName: 'Tom Johnson',
        clientEmail: 'tjohnson@company.com',
        subject: 'Remote Work VPN Access',
        content: 'I\'ll be transitioning to full remote work starting next Monday. Can you please set up VPN access for me? I\'ll need to connect to all development servers and resources. What information do you need from me to get this set up?',
        received: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        isRead: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-4',
      },
      {
        id: 'msg-5',
        clientId: 'client-sales',
        clientName: 'David Chen',
        clientEmail: 'dchen@company.com',
        subject: 'CRM Crashing When Generating Reports',
        content: 'After yesterday\'s software update, the CRM keeps crashing whenever anyone on the sales team tries to generate a report. This is happening on multiple computers. I\'ve attached the error log. We need this fixed ASAP as month-end reports are due tomorrow.',
        attachments: ['crm_error_log.txt'],
        received: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-5',
      },
      {
        id: 'msg-6',
        clientId: 'client-facilities',
        clientName: 'Robert Greene',
        clientEmail: 'rgreene@company.com',
        subject: 'Server Room Maintenance Request',
        content: 'I\'ve noticed the temperature in the server room seems to be running a bit higher than normal. Our logs show it\'s about 3-4 degrees above optimal. The last A/C maintenance was done about 6 months ago. Can we schedule preventive maintenance soon?',
        received: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        isRead: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-6',
      },
      {
        id: 'msg-7',
        clientId: 'client-warehouse',
        clientName: 'Lisa Park',
        clientEmail: 'lpark@company.com',
        subject: 'Windows Update Breaking Inventory Application',
        content: 'After the recent Windows security update, our inventory tracking application won\'t start at all. This is happening on all three computers in the warehouse. We\'re having to track everything manually which is causing significant delays. Can you either roll back the update or fix the compatibility issue?',
        received: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-7',
      },
      {
        id: 'msg-8',
        clientId: 'client-exec',
        clientName: 'Michael Davis',
        clientEmail: 'ceo@company.com',
        subject: 'New Laptop Request',
        content: 'I\'ll be traveling internationally next week for the European business summit. My current laptop has been having battery issues, and I\'d like to have a new one prepared before I leave. Please transfer all my data, email, and applications. I\'ll need it by Thursday at the latest.',
        received: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-9',
      },
      {
        id: 'msg-9',
        clientId: 'client-east-wing',
        clientName: 'Jennifer Kim',
        clientEmail: 'jkim@company.com',
        subject: 'Poor WiFi in East Wing Offices',
        content: 'Everyone in the east wing has been experiencing terrible WiFi connectivity for the past few weeks. Video calls keep dropping, and the internet speed is frustratingly slow. Can someone look into this? We\'ve tried moving closer to access points but it doesn\'t help much.',
        received: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        isRead: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-10',
      },
      {
        id: 'msg-10',
        clientId: 'client-accounting',
        clientName: 'Brian Williams',
        clientEmail: 'bwilliams@company.com',
        subject: 'Phishing Attempt Report and Training Request',
        content: 'We received what looks like a sophisticated phishing email targeting our accounting department. I\'ve forwarded it to security@company.com. Given this attempt, I think it would be wise to schedule a refresher training on identifying phishing attempts for our team. Could you arrange a session for the 12 people in our department?',
        attachments: ['phishing_email_example.pdf'],
        received: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        isRead: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-11',
      },
      {
        id: 'msg-11',
        clientId: 'client-conf',
        clientName: 'Patricia Jones',
        clientEmail: 'pjones@company.com',
        subject: 'Boardroom Video System Not Connecting',
        content: 'The video conferencing system in the main boardroom isn\'t connecting to any calls. We have an important client demo scheduled for 9am today and external clients can\'t join. The system was working perfectly yesterday afternoon. Please send someone immediately!',
        received: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        isRead: true,
        isFlagged: true,
        category: 'support',
        status: 'converted',
        relatedServiceId: 'ticket-13',
      },
      {
        id: 'msg-12',
        clientId: 'client-billing',
        clientName: 'Nathan Roberts',
        clientEmail: 'nroberts@company.com',
        subject: 'Question about software licenses',
        content: 'We\'re planning our departmental budget for next quarter and I had a question about our current software licensing costs. Can you provide a breakdown of what we\'re paying for design software licenses? Also, are there any volume discounts we should be aware of if we add 5 more seats?',
        received: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        isRead: false,
        category: 'billing',
        status: 'new',
      },
      {
        id: 'msg-13',
        clientId: 'client-hr',
        clientName: 'Emily Wong',
        clientEmail: 'ewong@company.com',
        subject: 'New Training Portal Feedback',
        content: 'I\'ve been testing the new employee training portal and have some feedback on usability issues we\'re encountering. The video playback is stuttering on Chrome browsers, and some users report they can\'t reset their passwords through the self-service option. Can we schedule a quick call to discuss these issues?',
        received: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isRead: false,
        category: 'feedback',
        status: 'new',
      },
      {
        id: 'msg-14',
        clientId: 'client-marketing',
        clientName: 'James Peterson',
        clientEmail: 'jpeterson@company.com',
        subject: 'Website update inquiry',
        content: 'We\'re planning to update our company website next month and I\'d like to know what the process would be for making significant changes. Do you handle this in-house or should we work with an external agency? We\'ll need new product pages, an updated blog, and possibly e-commerce functionality.',
        received: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        isRead: false,
        category: 'inquiry',
        status: 'new',
      },
      {
        id: 'msg-15',
        clientId: 'client-r&d',
        clientName: 'Sophia Patel',
        clientEmail: 'spatel@company.com',
        subject: 'Request for upgraded workstations',
        content: 'Our R&D team needs upgraded workstations to run the new simulation software we\'ve purchased. The minimum specs required are: 32GB RAM, 8-core processors, and dedicated GPUs with at least 8GB VRAM. Can you provide options and pricing for 6 machines that meet or exceed these specs?',
        received: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        isRead: true,
        category: 'inquiry',
        status: 'in-triage',
        assignedTo: 'tech-advisor-1',
      },
      {
        id: 'msg-16',
        clientId: 'client-legal',
        clientName: 'Christopher Lee',
        clientEmail: 'clee@company.com',
        subject: 'Document management system issues',
        content: 'Our legal team is experiencing slow response times with the document management system. Searches take over a minute to complete and sometimes time out entirely. This is affecting our productivity, especially when working with time-sensitive contracts. Can someone take a look at the server performance?',
        received: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        isRead: false,
        isFlagged: true,
        category: 'support',
        status: 'new',
      },
      {
        id: 'msg-17',
        clientId: 'client-finance',
        clientName: 'Laura Martinez',
        clientEmail: 'lmartinez@company.com',
        subject: 'Monthly IT services invoice question',
        content: 'I noticed that this month\'s invoice includes a charge for "additional storage allocation" that wasn\'t on previous invoices. Can you explain what this is for and whether this will be a recurring charge? I need to update our department budget if this is going to continue.',
        received: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        isRead: true,
        category: 'billing',
        status: 'in-triage',
        assignedTo: 'accounts-manager',
      },
      {
        id: 'msg-18',
        clientId: 'client-remote',
        clientName: 'Daniel Taylor',
        clientEmail: 'dtaylor@company.com',
        subject: 'Remote desktop connection failures',
        content: 'Since yesterday, I\'ve been unable to connect to my work desktop using the remote desktop tool. I get an error message saying "Cannot connect to remote computer." I\'ve tried restarting my home computer and router, but the issue persists. I have an important deadline tomorrow and need access to files on my work computer.',
        received: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
        isRead: false,
        category: 'support',
        status: 'new',
      },
      {
        id: 'msg-19',
        clientId: 'client-sales',
        clientName: 'Rachel Adams',
        clientEmail: 'radams@company.com',
        subject: 'Mobile device management app feedback',
        content: 'I wanted to provide some feedback on the new mobile device management app. While it has useful features, the battery drain is significant - my phone battery life has decreased by about 30% since installing it. Also, several team members have mentioned that it sometimes prevents other apps from sending notifications. Is there an update planned to address these issues?',
        received: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
        isRead: true,
        category: 'feedback',
        status: 'archived',
      },
      {
        id: 'msg-20',
        clientId: 'client-exec',
        clientName: 'Michelle Thompson',
        clientEmail: 'mthompson@company.com',
        subject: 'Executive dashboard access',
        content: 'As the new VP of Operations, I need access to the executive dashboard and reporting tools. My predecessor had custom reports set up that I\'d like to continue using. Could you please grant me the appropriate access rights and arrange a brief orientation session to make sure I know how to use all the features?',
        received: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        isRead: false,
        category: 'inquiry',
        status: 'new',
      }
    ];

    // Sample message threads
    this.messageThreads = [
      {
        id: 'thread-1',
        serviceRequestId: 'ticket-1',
        isArchived: false,
        messages: [
          {
            id: 'thread-1-msg-1',
            sender: 'client',
            senderName: 'Sarah Johnson',
            content: 'Our entire accounting department is unable to access the network. This is preventing us from processing end-of-month reports which are due today. None of the 8 workstations can connect to shared drives or internet. Please send someone ASAP.',
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            isRead: true,
          },
          {
            id: 'thread-1-msg-2',
            sender: 'provider',
            senderName: 'Alex Tech Support',
            content: 'We\'ve received your urgent request about the network outage in the accounting department. I\'ve dispatched our network specialist who should arrive within 30 minutes. In the meantime, have you tried restarting the network switch in your department?',
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 50 * 1000).toISOString(), // 1 hour 50 minutes ago
            isRead: true,
          },
          {
            id: 'thread-1-msg-3',
            sender: 'client',
            senderName: 'Sarah Johnson',
            content: 'We tried that already, but it didn\'t help. We\'ll wait for your specialist to arrive. Please let them know this is extremely urgent as we have financial reporting deadlines today.',
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 45 * 1000).toISOString(), // 1 hour 45 minutes ago
            isRead: true,
          },
          {
            id: 'thread-1-msg-4',
            sender: 'provider',
            senderName: 'Network Specialist',
            content: 'I\'ve arrived at the accounting department and identified the issue. It appears to be a failed network switch. I\'ve brought a replacement and will have it installed and configured within the next 20 minutes. Once that\'s done, we\'ll test all workstations to ensure proper connectivity.',
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 20 * 1000).toISOString(), // 1 hour 20 minutes ago
            isRead: true,
          },
          {
            id: 'thread-1-msg-5',
            sender: 'provider',
            senderName: 'Network Specialist',
            content: 'Update: The new switch has been installed and configured. All workstations should now have network connectivity. I\'ve tested 3 of the 8 machines and they can access shared drives and internet. Please have your team test the remaining computers and let us know if there are any issues.',
            timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
            isRead: false,
          }
        ]
      },
      {
        id: 'thread-2',
        serviceRequestId: 'ticket-4',
        isArchived: false,
        messages: [
          {
            id: 'thread-2-msg-1',
            sender: 'client',
            senderName: 'Tom Johnson',
            content: 'I\'ll be transitioning to full remote work starting next Monday. Can you please set up VPN access for me? I\'ll need to connect to all development servers and resources. What information do you need from me to get this set up?',
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            isRead: true,
          },
          {
            id: 'thread-2-msg-2',
            sender: 'provider',
            senderName: 'Security Team',
            content: 'Hi Tom, we\'ll need the following information to set up your VPN access:\n1. Your home IP address (you can find this by searching "what is my IP" on Google)\n2. The make and model of your work laptop\n3. Your mobile phone number for two-factor authentication\nAlso, have you completed the remote work security training module? It\'s required before we can enable VPN access.',
            timestamp: new Date(now.getTime() - 1 * 24 * 22 * 60 * 60 * 1000).toISOString(), // 1 day 22 hours ago
            isRead: true,
          },
          {
            id: 'thread-2-msg-3',
            sender: 'client',
            senderName: 'Tom Johnson',
            content: 'Thanks for the quick response. Here\'s the information:\n1. Home IP: 187.45.68.92\n2. Laptop: Dell XPS 15 9500\n3. Mobile: 555-123-4567\nI did complete the security training last month, but I can retake it if needed.',
            timestamp: new Date(now.getTime() - 1 * 24 * 20 * 60 * 60 * 1000).toISOString(), // 1 day 20 hours ago
            isRead: true,
          },
          {
            id: 'thread-2-msg-4',
            sender: 'provider',
            senderName: 'Security Team',
            content: 'I\'ve verified your security training completion. We\'ll get your VPN access set up within 24 hours. Once ready, you\'ll receive an email with installation instructions and your initial credentials. Please note that you\'ll need to change your password upon first login.',
            timestamp: new Date(now.getTime() - 1 * 24 * 18 * 60 * 60 * 1000).toISOString(), // 1 day 18 hours ago
            isRead: true,
          },
          {
            id: 'thread-2-msg-5',
            sender: 'provider',
            senderName: 'Security Team',
            content: 'Your VPN access is now set up. You should have received an email with installation and configuration instructions. Please install the VPN client today and test it before Monday to ensure everything works properly. Let us know if you encounter any issues during setup or testing.',
            timestamp: new Date(now.getTime() - 1 * 24 * 4 * 60 * 60 * 1000).toISOString(), // 1 day 4 hours ago
            isRead: false,
          }
        ]
      },
      {
        id: 'thread-3',
        serviceRequestId: 'ticket-13',
        isArchived: false,
        messages: [
          {
            id: 'thread-3-msg-1',
            sender: 'client',
            senderName: 'Patricia Jones',
            content: 'The video conferencing system in the main boardroom isn\'t connecting to any calls. We have an important client demo scheduled for 9am today and external clients can\'t join. The system was working perfectly yesterday afternoon. Please send someone immediately!',
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
            isRead: true,
          },
          {
            id: 'thread-3-msg-2',
            sender: 'provider',
            senderName: 'AV Support',
            content: 'I\'ll head to the boardroom right away. Have you tried restarting the system completely? Also, can you confirm if you\'re getting any specific error message on the screen?',
            timestamp: new Date(now.getTime() - 55 * 60 * 1000).toISOString(), // 55 minutes ago
            isRead: true,
          },
          {
            id: 'thread-3-msg-3',
            sender: 'client',
            senderName: 'Patricia Jones',
            content: 'Yes, we\'ve tried turning it off and on again several times. The error message says "Cannot establish connection to server" when we try to start or join a meeting. Please hurry, the client will be trying to connect in less than an hour.',
            timestamp: new Date(now.getTime() - 50 * 60 * 1000).toISOString(), // 50 minutes ago
            isRead: true,
          },
          {
            id: 'thread-3-msg-4',
            sender: 'provider',
            senderName: 'AV Support',
            content: 'I\'m in the boardroom now. It appears the network cable connecting the system to the wall port was damaged. I\'ve replaced it with a new cable and the system is now connecting properly. Can you try joining a test meeting to confirm it works for you?',
            timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            isRead: false,
          }
        ]
      },
      {
        id: 'thread-4',
        isArchived: false,
        messages: [
          {
            id: 'thread-4-msg-1',
            sender: 'client',
            senderName: 'Christopher Lee',
            content: 'Our legal team is experiencing slow response times with the document management system. Searches take over a minute to complete and sometimes time out entirely. This is affecting our productivity, especially when working with time-sensitive contracts. Can someone take a look at the server performance?',
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            isRead: false,
          }
        ]
      },
      {
        id: 'thread-5',
        isArchived: false,
        messages: [
          {
            id: 'thread-5-msg-1',
            sender: 'client',
            senderName: 'Daniel Taylor',
            content: 'Since yesterday, I\'ve been unable to connect to my work desktop using the remote desktop tool. I get an error message saying "Cannot connect to remote computer." I\'ve tried restarting my home computer and router, but the issue persists. I have an important deadline tomorrow and need access to files on my work computer.',
            timestamp: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
            isRead: false,
          }
        ]
      }
    ];
  }

  async getClientMessages(
    page = 1,
    limit = 10,
    filter?: Partial<ClientMessage>,
    delay = 400
  ): Promise<{ messages: ClientMessage[]; total: number; hasMore: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Filter messages if filter is provided
    let filteredMessages = this.clientMessages;
    if (filter) {
      filteredMessages = this.clientMessages.filter((message) => {
        return Object.entries(filter).every(([key, value]) => {
          return message[key as keyof ClientMessage] === value;
        });
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const messages = filteredMessages.slice(start, end);

    return {
      messages,
      total: filteredMessages.length,
      hasMore: end < filteredMessages.length,
    };
  }

  async getMessageById(id: string, delay = 300): Promise<ClientMessage | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    return message || null;
  }

  async getThreads(
    page = 1,
    limit = 10,
    delay = 400
  ): Promise<{ threads: MessageThread[]; total: number; hasMore: boolean }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const start = (page - 1) * limit;
    const end = start + limit;
    const threads = this.messageThreads.slice(start, end);

    return {
      threads,
      total: this.messageThreads.length,
      hasMore: end < this.messageThreads.length,
    };
  }

  async getThreadById(id: string, delay = 300): Promise<MessageThread | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const thread = this.messageThreads.find((thread) => thread.id === id);
    return thread || null;
  }

  async markMessageAsRead(id: string, assignedBy: string = 'system', delay = 200): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    if (message) {
      message.isRead = true;
      return true;
    }
    return false;
  }

  async markThreadMessageAsRead(threadId: string, messageId: string, delay = 200): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const thread = this.messageThreads.find((thread) => thread.id === threadId);
    if (thread) {
      const message = thread.messages.find((message) => message.id === messageId);
      if (message) {
        message.isRead = true;
        return true;
      }
    }
    return false;
  }

  async flagMessage(id: string, isFlagged: boolean, delay = 200): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    if (message) {
      message.isFlagged = isFlagged;
      return true;
    }
    return false;
  }

  async updateMessageStatus(id: string, status: ClientMessage['status'], delay = 300): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    if (message) {
      message.status = status;
      return true;
    }
    return false;
  }

  async assignMessage(id: string, assignedTo: string, delay = 300): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    if (message) {
      message.assignedTo = assignedTo;
      return true;
    }
    return false;
  }

  async setRelatedServiceId(id: string, relatedServiceId: string, delay = 300): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const message = this.clientMessages.find((message) => message.id === id);
    if (message) {
      message.relatedServiceId = relatedServiceId;
      return true;
    }
    return false;
  }

  async addMessageToThread(threadId: string, message: Omit<ThreadMessage, 'id'>, delay = 300): Promise<string | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const thread = this.messageThreads.find((thread) => thread.id === threadId);
    if (thread) {
      const newMessageId = `${threadId}-msg-${thread.messages.length + 1}`;
      const newMessage = {
        ...message,
        id: newMessageId,
      };
      thread.messages.push(newMessage);
      return newMessageId;
    }
    return null;
  }

  async createNewThread(initialMessage: Omit<ThreadMessage, 'id'>, serviceRequestId?: string, delay = 400): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const threadId = `thread-${this.messageThreads.length + 1}`;
    const messageId = `${threadId}-msg-1`;
    
    const newThread: MessageThread = {
      id: threadId,
      serviceRequestId,
      isArchived: false,
      messages: [
        {
          ...initialMessage,
          id: messageId,
        },
      ],
    };
    
    this.messageThreads.push(newThread);
    return threadId;
  }

  async archiveThread(threadId: string, isArchived: boolean, delay = 300): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const thread = this.messageThreads.find((thread) => thread.id === threadId);
    if (thread) {
      thread.isArchived = isArchived;
      return true;
    }
    return false;
  }

  async getRelatedMessages(serviceRequestId: string, delay = 300): Promise<ClientMessage[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.clientMessages.filter((message) => message.relatedServiceId === serviceRequestId);
  }

  async getUnreadMessageCount(delay = 200): Promise<number> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.clientMessages.filter((message) => !message.isRead).length;
  }

  async updateMessageThread(threadId: string, updates: Partial<MessageThread>, delay = 300): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const thread = this.messageThreads.find((thread) => thread.id === threadId);
    if (thread) {
      Object.assign(thread, updates);
      return true;
    }
    return false;
  }

  async searchMessages(
    query: string,
    page = 1, 
    limit = 10,
    delay = 500
  ): Promise<{ messages: ClientMessage[]; total: number }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const lcQuery = query.toLowerCase();
    const matches = this.clientMessages.filter(message => 
      message.subject.toLowerCase().includes(lcQuery) || 
      message.content.toLowerCase().includes(lcQuery) || 
      message.clientName.toLowerCase().includes(lcQuery) ||
      message.clientEmail.toLowerCase().includes(lcQuery)
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      messages: matches.slice(start, end),
      total: matches.length
    };
  }

  async batchUpdateMessages(
    messageIds: string[],
    updates: Partial<ClientMessage>,
    delay = 400
  ): Promise<{ success: boolean; updatedCount: number }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    let updatedCount = 0;

    this.clientMessages = this.clientMessages.map(message => {
      if (messageIds.includes(message.id)) {
        updatedCount++;
        return { ...message, ...updates };
      }
      return message;
    });

    return {
      success: updatedCount > 0,
      updatedCount
    };
  }

  async createClientMessage(
    newMessage: Omit<ClientMessage, 'id'>,
    delay = 300
  ): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const id = `msg-${this.clientMessages.length + 1}`;
    
    const message: ClientMessage = {
      ...newMessage,
      id
    };
    
    this.clientMessages.push(message);
    return id;
  }
}

// Export singleton instance
export const clientMsgDb = new ClientMessagesDatabase();