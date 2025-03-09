'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  TicketCheck,
  Users,
  Clock,
  FileText,
  Settings,
  Calendar,
  Database,
  HardDrive,
  Network,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  collapsed?: boolean;
  badgeCount?: number;
  badgeColor?: string;
}

const NavItem = ({
  href,
  icon: Icon,
  title,
  collapsed,
  badgeCount,
  badgeColor = 'bg-primary',
}: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all relative',
        isActive
          ? 'text-primary bg-primary/10 font-medium'
          : 'hover:bg-muted text-foreground',
        collapsed && 'justify-center py-3'
      )}
    >
      <Icon className={cn('h-5 w-5', collapsed ? 'h-6 w-6' : '')} />
      {!collapsed && <span>{title}</span>}

      {badgeCount !== undefined && badgeCount > 0 && (
        <Badge
          className={cn(
            'ml-auto text-xs',
            badgeColor,
            collapsed &&
              'absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center'
          )}
        >
          {badgeCount}
        </Badge>
      )}
    </Link>
  );
};

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  // In a real application, these counts would come from your data/API
  const unreadMessages = 3;
  const activeRequests = 5;
  const pendingInvoices = 2;

  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard',
    },
    {
      href: '/messages',
      icon: MessageSquare,
      title: 'Client Messages',
      badgeCount: unreadMessages,
      badgeColor: 'bg-blue-500',
    },
    {
      href: '/service-requests',
      icon: TicketCheck,
      title: 'Service Requests',
      badgeCount: activeRequests,
      badgeColor: 'bg-yellow-500',
    },
    {
      href: '/clients',
      icon: Users,
      title: 'Client Management',
    },
    {
      href: '/time-tracking',
      icon: Clock,
      title: 'Time Tracking',
    },
    {
      href: '/invoices',
      icon: FileText,
      title: 'Invoices',
      badgeCount: pendingInvoices,
      badgeColor: 'bg-green-500',
    },
    {
      href: '/schedule',
      icon: Calendar,
      title: 'Schedule',
    },
  ];

  // Service categories submenu
  const serviceCategories = [
    {
      href: '/services/hardware',
      icon: HardDrive,
      title: 'Hardware Support',
    },
    {
      href: '/services/software',
      icon: Database,
      title: 'Software Support',
    },
    {
      href: '/services/network',
      icon: Network,
      title: 'Network Services',
    },
    {
      href: '/services/security',
      icon: Shield,
      title: 'Security Services',
    },
  ];

  return (
    <div className={cn('flex flex-col')}>
      <div className="px-3 py-2">
        <h2
          className={cn(
            'text-xs font-medium uppercase text-muted-foreground mb-2',
            collapsed && 'sr-only'
          )}
        >
          Main
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              collapsed={collapsed}
              badgeCount={item.badgeCount}
              badgeColor={item.badgeColor}
            />
          ))}
        </div>
      </div>

      <div className="px-3 py-2 mt-6">
        <h2
          className={cn(
            'text-xs font-medium uppercase text-muted-foreground mb-2',
            collapsed && 'sr-only'
          )}
        >
          Service Areas
        </h2>
        <div className="space-y-1">
          {serviceCategories.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              collapsed={collapsed}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto px-3 py-2">
        <NavItem
          href="/settings"
          icon={Settings}
          title="Settings"
          collapsed={collapsed}
        />
      </div>
    </div>
  );
}
