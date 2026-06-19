import { create } from "zustand";

interface AboutData {
  _id?: string;
  title: string;
  caption: string;
  body: string;
}

interface AboutStore {
  /* ---------------- STATE ---------------- */

  about: AboutData;

  loading: boolean;

  fetching: boolean;

  error: string | null;

  /* ---------------- ACTIONS ---------------- */

  setAbout: (data: Partial<AboutData>) => void;

  resetAbout: () => void;

  fetchAbout: () => Promise<void>;

  updateAbout: () => Promise<boolean>;
}

const initialState: AboutData = {
  title: "",
  caption: "",
  body: "",
};

export const useAboutStore = create<AboutStore>((set, get) => ({
  /* ---------------- STATE ---------------- */

  about: initialState,

  loading: false,

  fetching: false,

  error: null,

  /* ---------------- SETTERS ---------------- */

  setAbout: (data) =>
    set((state) => ({
      about: {
        ...state.about,
        ...data,
      },
    })),

  resetAbout: () =>
    set({
      about: initialState,
    }),

  /* ---------------- FETCH ---------------- */

  fetchAbout: async () => {
    try {
      set({
        fetching: true,
        error: null,
      });

      const response = await fetch("/api/about");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch about content");
      }

      set({
        about: data.data || initialState,
      });
    } catch (error: any) {
      console.error(error);

      set({
        error: error.message || "Something went wrong",
      });
    } finally {
      set({
        fetching: false,
      });
    }
  },

  /* ---------------- UPDATE ---------------- */

  updateAbout: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const { about } = get();

      const response = await fetch("/api/about", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(about),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update content");
      }

      set({
        about: data.data,
      });

      return true;
    } catch (error: any) {
      console.error(error);

      set({
        error: error.message || "Something went wrong",
      });

      return false;
    } finally {
      set({
        loading: false,
      });
    }
  },
}));
