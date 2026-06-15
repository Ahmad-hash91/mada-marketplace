import { create } from "zustand";

interface MobileSidebarStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useMobileSidebarStore = create<MobileSidebarStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}));
