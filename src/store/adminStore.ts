import { create } from "zustand";

let toastTimer: ReturnType<typeof setTimeout> | null = null;

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface DeleteModalState {
  id: string;
  title: string;
  module: string;
}

interface AdminStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  activeModule: string;
  setActiveModule: (module: string) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  toast: ToastState | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;

  deleteModal: DeleteModalState | null;
  openDeleteModal: (id: string, title: string, module: string) => void;
  closeDeleteModal: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarOpen: true,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) =>
    set({
      sidebarOpen: open,
    }),

  activeModule: "dashboard",

  setActiveModule: (module) =>
    set({
      activeModule: module,
    }),

  isLoading: false,

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  toast: null,

  showToast: (message, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, 4000);
  },

  clearToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast: null });
  },

  deleteModal: null,

  openDeleteModal: (id, title, module) =>
    set({
      deleteModal: {
        id,
        title,
        module,
      },
    }),

  closeDeleteModal: () =>
    set({
      deleteModal: null,
    }),
}));
