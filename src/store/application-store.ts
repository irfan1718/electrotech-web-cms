import { create } from "zustand";

export interface ApplicationData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  cvUrl: string;
  cvFileName: string;
  coverNote: string;
  status: string;
  createdAt: string;
}

interface ApplicationStore {
  applications: ApplicationData[];
  fetching: boolean;
  error: string | null;

  fetchApplications: () => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<boolean>;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  fetching: false,
  error: null,

  fetchApplications: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/careers/applications");
      const data = await res.json();
      if (data.success) {
        set({ applications: data.data });
      }
    } catch (err) {
      set({ error: "Failed to fetch applications" });
    } finally {
      set({ fetching: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`/api/careers/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        set((state) => ({
          applications: state.applications.map((app) =>
            app._id === id ? { ...app, status } : app,
          ),
        }));
      }
    } catch {}
  },

  deleteApplication: async (id) => {
    try {
      const res = await fetch(`/api/careers/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        set((state) => ({
          applications: state.applications.filter((app) => app._id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
