import { create } from "zustand";

export interface TeamData {
  _id?: string;
  name: string;
  designation: string;
  caption: string;
  profileImage: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamStore {
  members: TeamData[];
  current: TeamData;
  loading: boolean;
  fetching: boolean;
  error: string | null;

  setMembers: (members: TeamData[]) => void;
  setCurrent: (data: Partial<TeamData>) => void;
  resetCurrent: () => void;
  fetchMembers: () => Promise<void>;
  fetchMemberById: (id: string) => Promise<void>;
  createMember: () => Promise<boolean>;
  updateMember: (id: string) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
}

const initialMember: TeamData = {
  name: "",
  designation: "",
  caption: "",
  profileImage: null,
  order: 0,
};

export const useTeamStore = create<TeamStore>((set, get) => ({
  members: [],
  current: initialMember,
  loading: false,
  fetching: false,
  error: null,

  setMembers: (members) => set({ members }),

  setCurrent: (data) =>
    set((state) => ({
      current: { ...state.current, ...data },
    })),

  resetCurrent: () => set({ current: initialMember }),

  fetchMembers: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/team");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      set({ members: data.data || [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  fetchMemberById: async (id: string) => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch(`/api/team/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      set({ current: { ...initialMember, ...data.data } });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  createMember: async () => {
    try {
      set({ loading: true, error: null });
      const { current } = get();

      const res = await fetch("/api/team", {
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

  updateMember: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = current;

      const res = await fetch(`/api/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      set({ current: { ...initialMember, ...data.data } });
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

  deleteMember: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      set((state) => ({
        members: state.members.filter((m) => m._id !== id),
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
