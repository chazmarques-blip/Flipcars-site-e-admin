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
} from 'lucide-react';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { useAuthStore } from '@/stores/authStore';
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
    label: 'AI Chat',
    href: '/dashboard/chat',
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
  const user = useAuthStore((state) => state.user);

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.role as UserRole);
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
          'fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300',
          'flex flex-col',
          isOpen ? 'w-64' : 'w-20',
          isMobile && !isOpen && '-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link
            href="/dashboard"
            className={clsx(
              'flex items-center gap-3 transition-opacity',
              !isOpen && 'opacity-0'
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">
              FlipCars
            </span>
          </Link>

          {!isMobile && (
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft
                className={clsx(
                  'w-5 h-5 text-gray-600 transition-transform',
                  !isOpen && 'rotate-180'
                )}
              />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
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
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-5 h-5 flex-shrink-0',
                        isActive ? 'text-white' : 'text-gray-600'
                      )}
                    />
                    <span
                      className={clsx(
                        'font-medium transition-opacity',
                        !isOpen && 'opacity-0 absolute'
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
          <div className="p-4 border-t border-gray-200">
            <div
              className={clsx(
                'flex items-center gap-3 transition-opacity',
                !isOpen && 'opacity-0'
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
                <span className="text-primary-700 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
