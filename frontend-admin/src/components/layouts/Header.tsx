'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui';
import { NotificationBell } from '@/components/notifications';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export function Header() {
  const router = useRouter();
  const { toggle } = useSidebar();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-900 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gold" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg w-80 border border-gray-700">
            <Search className="w-4 h-4 text-gold" />
            <input
              type="text"
              placeholder="Search leads, customers, claims..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-900 transition-colors md:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gold" />
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gold rounded-full">
                  <span className="text-black font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-400">
                    {user.role.replace('_', ' ')}
                  </p>
                </div>
                <ChevronDown
                  className={clsx(
                    'w-4 h-4 text-gold transition-transform hidden lg:block',
                    showUserMenu && 'rotate-180'
                  )}
                />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-800">
                      <p className="text-sm font-medium text-gray-100">{user.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                      <div className="mt-2">
                        <Badge variant="secondary" size="sm">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push('/dashboard/profile');
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-300">My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push('/dashboard/settings');
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-gold" />
                        <span className="text-sm text-gray-300">Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-900/20 transition-colors text-left text-danger"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
