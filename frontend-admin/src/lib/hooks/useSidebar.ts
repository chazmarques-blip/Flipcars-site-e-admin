'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      isMobile: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setIsMobile: (isMobile: boolean) => set({ isMobile }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ isOpen: state.isOpen }),
    }
  )
);
