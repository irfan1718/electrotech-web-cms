import { create } from "zustand";

export interface ProjectData {
  _id?: string;
  title: string;
  slug: string;
  caption: string;
  body: string;
  thumbnail: string | null;
  images: string[];
  detailBody: string | null;
  status: "published" | "draft";
  projectStatus: "awarded" | "in-progress" | "completed";
  category: string;
  location: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectsStore {
  projects: ProjectData[];
  current: ProjectData;
  loading: boolean;
  fetching: boolean;
  error: string | null;

  setProjects: (projects: ProjectData[]) => void;
  setCurrent: (data: Partial<ProjectData>) => void;
  resetCurrent: () => void;
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  createProject: () => Promise<boolean>;
  updateProject: (id: string) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

const initialProject: ProjectData = {
  title: "",
  slug: "",
  caption: "",
  body: "",
  thumbnail: null,
  images: [],
  detailBody: null,
  status: "draft",
  projectStatus: "in-progress",
  category: "",
  location: "",
  tags: [],
};

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [],
  current: initialProject,
  loading: false,
  fetching: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  setCurrent: (data) =>
    set((state) => ({
      current: { ...state.current, ...data },
    })),

  resetCurrent: () => set({ current: initialProject }),

  fetchProjects: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      set({ projects: data.data || [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  fetchProjectById: async (id: string) => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      set({ current: { ...initialProject, ...data.data } });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  createProject: async () => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      const slug =
        current.slug ||
        current.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, slug }),
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

  updateProject: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = current;
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      set({ current: { ...initialProject, ...data.data } });
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

  deleteProject: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
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
