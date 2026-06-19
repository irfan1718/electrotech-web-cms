import { create } from "zustand";

export interface InquiryData {
  _id?: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt?: string;
}

interface InquiriesStore {
  inquiries: InquiryData[];
  fetching: boolean;
  error: string | null;

  setInquiries: (inquiries: InquiryData[]) => void;
  fetchInquiries: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAsUnread: (id: string) => Promise<boolean>;
  markAllRead: () => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;
}

export const useInquiriesStore = create<InquiriesStore>((set, get) => ({
  inquiries: [],
  fetching: false,
  error: null,

  setInquiries: (inquiries) => set({ inquiries }),

  fetchInquiries: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      set({ inquiries: data.data || [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });
      if (!res.ok) return false;

      set((state) => ({
        inquiries: state.inquiries.map((inq) =>
          inq._id === id ? { ...inq, status: "read" as const } : inq,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  markAsUnread: async (id: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "unread" }),
      });
      if (!res.ok) return false;

      set((state) => ({
        inquiries: state.inquiries.map((inq) =>
          inq._id === id ? { ...inq, status: "unread" as const } : inq,
        ),
      }));
      return true;
    } catch {
      return false;
    }
  },

  markAllRead: async () => {
    try {
      const { inquiries } = get();
      const unread = inquiries.filter((i) => i.status === "unread");

      for (const inq of unread) {
        await fetch("/api/contact", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: inq._id, status: "read" }),
        });
      }

      set((state) => ({
        inquiries: state.inquiries.map((inq) => ({
          ...inq,
          status: "read" as const,
        })),
      }));
      return true;
    } catch {
      return false;
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return false;

      set((state) => ({
        inquiries: state.inquiries.filter((inq) => inq._id !== id),
      }));
      return true;
    } catch {
      return false;
    }
  },
}));
