import { create } from "zustand";

export interface BlogData {
  _id?: string;
  title: string;
  slug: string;
  caption: string;
  body: string;
  thumbnail: string | null;
  images: string[];
  detailBody: string | null;
  publishDate: string;
  status: "published" | "draft";
  createdAt?: string;
  updatedAt?: string;
}

interface BlogsStore {
  blogs: BlogData[];
  current: BlogData;
  loading: boolean;
  fetching: boolean;
  error: string | null;

  setBlogs: (blogs: BlogData[]) => void;
  setCurrent: (data: Partial<BlogData>) => void;
  resetCurrent: () => void;
  fetchBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: () => Promise<boolean>;
  updateBlog: (id: string) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
}

const initialBlog: BlogData = {
  title: "",
  slug: "",
  caption: "",
  body: "",
  thumbnail: null,
  images: [],
  detailBody: null,
  publishDate: new Date().toISOString().split("T")[0],
  status: "draft",
};

export const useBlogsStore = create<BlogsStore>((set, get) => ({
  blogs: [],
  current: initialBlog,
  loading: false,
  fetching: false,
  error: null,

  setBlogs: (blogs) => set({ blogs }),

  setCurrent: (data) =>
    set((state) => ({
      current: { ...state.current, ...data },
    })),

  resetCurrent: () => set({ current: initialBlog }),

  fetchBlogs: async () => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      set({ blogs: data.data || [] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  fetchBlogById: async (id: string) => {
    try {
      set({ fetching: true, error: null });
      const res = await fetch(`/api/blogs/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");

      // Format publishDate for the date input
      const blog = data.data;
      if (blog.publishDate) {
        blog.publishDate = new Date(blog.publishDate)
          .toISOString()
          .split("T")[0];
      }

      set({ current: { ...initialBlog, ...blog } });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: message });
    } finally {
      set({ fetching: false });
    }
  },

  createBlog: async () => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      const slug =
        current.slug ||
        current.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/blogs", {
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

  updateBlog: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { current } = get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, ...updateData } = current;
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      set({ current: { ...initialBlog, ...data.data } });
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

  deleteBlog: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      set((state) => ({
        blogs: state.blogs.filter((b) => b._id !== id),
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
