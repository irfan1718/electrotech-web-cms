import { create } from "zustand";

export interface ServiceData {
  _id?: string;
  title: string;
  slug: string;
  caption: string;
  body: string;
  thumbnail: string | null;
  detailBody: string | null;
  order: number;
}

interface ServicesStore {
  services: ServiceData[];
  current: ServiceData;
  loading: boolean;
  fetching: boolean;
  error: string | null;

  setServices: (services: ServiceData[]) => void;
  setCurrent: (data: Partial<ServiceData>) => void;
  resetCurrent: () => void;
  fetchServices: () => Promise<void>;
  fetchServiceById: (id: string) => Promise<void>;
  createService: () => Promise<boolean>;
  updateService: (id: string) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
}

const initialService: ServiceData = {
  title: "",
  slug: "",
  caption: "",
  body: "",
  thumbnail: null,
  detailBody: null,
  order: 0,
};

export const useServicesStore = create<ServicesStore>((set, get) => ({
  services: [],
  current: initialService,
  loading: false,
  fetching: false,
  error: null,

  setServices: (services) => set({ services }),

  setCurrent: (data) =>
    set((state) => ({
      current: { ...state.current, ...data },
    })),

  resetCurrent: () => set({ current: initialService }),

  /* ── FETCH ALL ── */
  fetchServices: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/services");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      set({ services: data.data || [] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  /* ── FETCH SINGLE ── */
  fetchServiceById: async (id: string) => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch(`/api/services/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Not found");

      set({ current: { ...initialService, ...data.data } });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  /* ── CREATE ── */
  createService: async () => {
    try {
      set({ loading: true, error: null });
      const { current } = get();

      // Auto-generate slug from title
      const slug =
        current.slug ||
        current.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, slug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  /* ── UPDATE ── */
  updateService: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...updateData } = current;

      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      set({ current: { ...initialService, ...data.data } });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  /* ── DELETE ── */
  deleteService: async (id: string) => {
    try {
      set({ loading: true, error: null });

      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete");

      set((state) => ({
        services: state.services.filter((s) => s._id !== id),
      }));

      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
