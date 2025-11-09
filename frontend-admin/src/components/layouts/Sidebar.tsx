'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Car,
  FileText,
  MessageSquare,
  Settings,
  ChevronLeft,
  LucideIcon,
  BarChart3,
  FolderOpen,
  Mail,
  Search,
  Activity,
} from 'lucide-react';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import clsx from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: Car,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AGENT],
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: UserCircle,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AGENT],
  },
  {
    label: 'Claims',
    href: '/dashboard/claims',
    icon: FileText,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AGENT],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: 'Files',
    href: '/dashboard/files',
    icon: FolderOpen,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.AGENT],
  },
  {
    label: 'Emails',
    href: '/dashboard/emails',
    icon: Mail,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: 'Search',
    href: '/dashboard/search',
    icon: Search,
  },
  {
    label: 'Activity Log',
    href: '/dashboard/activity',
    icon: Activity,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    label: 'AI Chat',
    href: '/dashboard/ai-chat',
    icon: MessageSquare,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user || !user.roles) return false;
    // Check if user has any of the required roles
    return user.roles.some(userRole => 
      item.roles?.includes(userRole as UserRole)
    );
  });

  const handleLinkClick = () => {
    if (isMobile) {
      close();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen bg-black border-r border-gray-800 transition-all duration-300',
          'flex flex-col',
          isOpen ? 'w-64' : 'w-20',
          isMobile && !isOpen && '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link
            href="/dashboard"
            className={clsx(
              'flex items-center transition-opacity',
              !isOpen && 'opacity-0'
            )}
          >
            <img 
              src="/flipcars-logo.png" 
              alt="FlipCars" 
              className="h-8 w-auto"
            />
          </Link>

          {!isMobile && (
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <ChevronLeft
                className={clsx(
                  'w-5 h-5 text-gold transition-transform',
                  !isOpen && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <ul className="space-y-1 px-3">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      'group relative',
                      isActive
                        ? 'bg-gold text-black'
                        : 'text-gray-300 hover:bg-gray-900'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-5 h-5 flex-shrink-0',
                        isActive ? 'text-black' : 'text-gold'
                      )}
                    />
                    <span
                      className={clsx(
                        'font-medium text-sm transition-opacity',
                        !isOpen && 'opacity-0 absolute'
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gold text-black text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Section */}
        {user && (
          <div className="p-4 border-t border-gray-800">
            <div
              className={clsx(
                'flex items-center gap-3 transition-opacity',
                !isOpen && 'opacity-0'
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gold rounded-full">
                <span className="text-black font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.roles?.[0]?.replace('_', ' ') || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
