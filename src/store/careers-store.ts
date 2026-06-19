import { create } from "zustand";

export interface CareerData {
  _id?: string;
  title: string;
  location: string;
  caption: string;
  description: string;
  status: "open" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

interface CareersStore {
  careers: CareerData[];
  current: CareerData;
  loading: boolean;
  fetching: boolean;
  error: string | null;

  setCareers: (careers: CareerData[]) => void;
  setCurrent: (data: Partial<CareerData>) => void;
  resetCurrent: () => void;
  fetchCareers: () => Promise<void>;
  fetchCareerById: (id: string) => Promise<void>;
  createCareer: () => Promise<boolean>;
  updateCareer: (id: string) => Promise<boolean>;
  deleteCareer: (id: string) => Promise<boolean>;
}

const initialCareer: CareerData = {
  title: "",
  location: "",
  caption: "",
  description: "",
  status: "open",
};

export const useCareersStore = create<CareersStore>((set, get) => ({
  careers: [],
  current: initialCareer,
  loading: false,
  fetching: false,
  error: null,

  setCareers: (careers) => set({ careers }),

  setCurrent: (data) =>
    set((state) => ({
      current: { ...state.current, ...data },
    })),

  resetCurrent: () => set({ current: initialCareer }),

  fetchCareers: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/careers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      set({ careers: data.data || [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  fetchCareerById: async (id: string) => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch(`/api/careers/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      set({ current: { ...initialCareer, ...data.data } });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  createCareer: async () => {
    try {
      set({ loading: true, error: null });
      const { current } = get();

      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCareer: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = current;

      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      set({ current: { ...initialCareer, ...data.data } });
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteCareer: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      set((state) => ({
        careers: state.careers.filter((c) => c._id !== id),
      }));
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
